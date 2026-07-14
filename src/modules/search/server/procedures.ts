import { z } from "zod";
import { and, desc, eq, sql, cosineDistance } from "drizzle-orm";

import { db } from "@/db";
import { meetings, transcriptChunks } from "@/db/schema";
import { embeddingsAvailable, embedText } from "@/lib/embeddings";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const searchRouter = createTRPCRouter({
  transcripts: protectedProcedure
    .input(
      z.object({
        query: z.string().min(3).max(500),
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!embeddingsAvailable()) {
        return { available: false as const, results: [] };
      }

      const queryEmbedding = await embedText(input.query);

      if (!queryEmbedding) {
        return { available: false as const, results: [] };
      }

      const similarity = sql<number>`1 - (${cosineDistance(
        transcriptChunks.embedding,
        queryEmbedding,
      )})`;

      const results = await db
        .select({
          chunkId: transcriptChunks.id,
          meetingId: transcriptChunks.meetingId,
          meetingName: meetings.name,
          meetingDate: meetings.startedAt,
          content: transcriptChunks.content,
          similarity,
        })
        .from(transcriptChunks)
        .innerJoin(meetings, eq(transcriptChunks.meetingId, meetings.id))
        .where(
          and(
            eq(transcriptChunks.userId, ctx.auth.user.id),
            // Only surface reasonably relevant matches
            sql`${similarity} > 0.2`,
          )
        )
        .orderBy(desc(similarity))
        .limit(input.limit);

      return { available: true as const, results };
    }),
});
