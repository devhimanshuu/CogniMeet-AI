import { z } from "zod";
import JSONL from "jsonl-parse-stringify";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm";

import { nanoid } from "nanoid";

import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { generateAvatarUri } from "@/lib/avatar";
import { streamVideo } from "@/lib/stream-video";
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

import { MeetingStatus, StreamTranscriptItem } from "../types";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { parseActionItems } from "../utils";
import { streamChat } from "@/lib/stream-chat";

export const meetingsRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [meetingCount] = await db
      .select({ count: count() })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [completedMeetings] = await db
      .select({
        count: count(),
        totalDuration: sql<number>`COALESCE(SUM(EXTRACT(EPOCH FROM (ended_at - started_at))), 0)`,
        avgScore: sql<number>`COALESCE(AVG(meeting_score), 0)`,
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, ctx.auth.user.id),
          eq(meetings.status, "completed"),
        )
      );

    const actionItemRows = await db
      .select({ actionItems: meetings.actionItems })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, ctx.auth.user.id),
          eq(meetings.status, "completed"),
          sql`${meetings.actionItems} IS NOT NULL`,
        )
      );

    let totalActionItems = 0;
    for (const row of actionItemRows) {
      totalActionItems += parseActionItems(row.actionItems).length;
    }

    const scoreTrend = await db
      .select({
        id: meetings.id,
        name: meetings.name,
        score: meetings.meetingScore,
        createdAt: meetings.createdAt,
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, ctx.auth.user.id),
          eq(meetings.status, "completed"),
          sql`${meetings.meetingScore} IS NOT NULL`,
        )
      )
      .orderBy(desc(meetings.createdAt))
      .limit(10)
      .then((rows) => rows.reverse());

    const totalHours = Number(completedMeetings.totalDuration) / 3600;
    const avgScore = Math.round(Number(completedMeetings.avgScore));

    return {
      totalMeetings: meetingCount.count,
      totalActionItems,
      hoursRecorded: Math.round(totalHours * 10) / 10,
      avgScore,
      scoreTrend,
    };
  }),
  generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
    const token = streamChat.createToken(ctx.auth.user.id);
    await streamChat.upsertUser({
      id: ctx.auth.user.id,
      role: "user",
    });

    return token;
  }),
  getTranscript: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      let transcript: StreamTranscriptItem[] = [];

      if (existingMeeting.transcript) {
        // Preferred: the copy persisted at processing time (Stream's hosted
        // transcript URL expires after a while)
        try {
          transcript = JSON.parse(existingMeeting.transcript);
        } catch {
          transcript = [];
        }
      } else if (existingMeeting.transcriptUrl) {
        transcript = await fetch(existingMeeting.transcriptUrl)
          .then((res) => res.text())
          .then((text) => JSONL.parse<StreamTranscriptItem>(text))
          .catch(() => {
            return [];
          });
      }

      if (transcript.length === 0) {
        return [];
      }

      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
            image:
              user.image ??
              generateAvatarUri({ seed: user.name, variant: "initials" }),
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
            image: generateAvatarUri({
              seed: agent.name,
              variant: "botttsNeutral",
            }),
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      const transcriptWithSpeakers = transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
              image: generateAvatarUri({
                seed: "Unknown",
                variant: "initials",
              }),
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
            image: speaker.image,
          },
        };
      })

      return transcriptWithSpeakers;
    }),
  // Public: guests join via an unguessable meeting link without an account.
  // Only meetings that haven't finished can be joined.
  generateGuestToken: baseProcedure
    .input(
      z.object({
        meetingId: z.string().min(1),
        name: z.string().trim().min(1).max(50),
      })
    )
    .mutation(async ({ input }) => {
      const [existingMeeting] = await db
        .select({ id: meetings.id, name: meetings.name, status: meetings.status })
        .from(meetings)
        .where(eq(meetings.id, input.meetingId));

      if (
        !existingMeeting ||
        (existingMeeting.status !== "upcoming" && existingMeeting.status !== "active")
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This meeting is not available to join",
        });
      }

      const guestId = `guest-${nanoid()}`;

      await streamVideo.upsertUsers([
        {
          id: guestId,
          name: input.name,
          role: "user",
          image: generateAvatarUri({ seed: input.name, variant: "initials" }),
        },
      ]);

      const expirationTime = Math.floor(Date.now() / 1000) + 4 * 3600; // 4 hours
      const issuedAt = Math.floor(Date.now() / 1000) - 60;

      const token = streamVideo.generateUserToken({
        user_id: guestId,
        exp: expirationTime,
        iat: issuedAt,
      });

      return {
        token,
        guestId,
        meetingName: existingMeeting.name,
      };
    }),
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "user",
        image:
          ctx.auth.user.image ??
          generateAvatarUri({ seed: ctx.auth.user.name, variant: "initials" }),
      },
    ]);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      iat: issuedAt,
    });

    return token;
  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedMeeting] = await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          )
        )
        .returning();

      if (!removedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return removedMeeting;
    }),
  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [existingMeeting] = await db
        .select({ status: meetings.status, agentId: meetings.agentId })
        .from(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      // Reassigning the agent after the fact would corrupt history: the
      // summary, transcript, and post-meeting chat all belong to the
      // original agent.
      if (
        input.agentId &&
        input.agentId !== existingMeeting.agentId &&
        existingMeeting.status !== "upcoming"
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The agent can only be changed while the meeting is upcoming",
        });
      }

      const [updatedMeeting] = await db
        .update(meetings)
        .set({ ...input, updatedAt: new Date() })
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          )
        )
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return updatedMeeting;
    }),
  toggleActionItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        index: z.number().int().min(0),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [existingMeeting] = await db
        .select({ actionItems: meetings.actionItems })
        .from(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          )
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      const items = parseActionItems(existingMeeting.actionItems);

      if (input.index >= items.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Action item not found",
        });
      }

      items[input.index] = { ...items[input.index], done: input.done };

      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          actionItems: JSON.stringify(items),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          )
        )
        .returning();

      return updatedMeeting;
    }),
  create: premiumProcedure("meetings")
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: "user",
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: "botttsNeutral",
          }),
        },
      ]);

      const call = streamVideo.video.call("default", createdMeeting.id);
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          // Register the owner and agent as members so call-level
          // permissions can be scoped to membership
          members: [
            { user_id: ctx.auth.user.id },
            { user_id: existingAgent.id },
          ],
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      return createdMeeting;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
    const [existingMeeting] = await db
      .select({
        ...getTableColumns(meetings),
        agent: agents,
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(
        and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.auth.user.id),
        )
      );

    if (!existingMeeting) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
    }

    return existingMeeting;
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize, status, agentId } = input;

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});