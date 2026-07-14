import { eq, inArray, and, desc, sql, cosineDistance } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";

import { db } from "@/db";
import { agents, meetings, notifications, transcriptChunks, user } from "@/db/schema";
import {
  chunkTranscriptLines,
  embeddingsAvailable,
  embedText,
  embedTexts,
} from "@/lib/embeddings";
import { inngest } from "@/inngest/client";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";

import { StreamTranscriptItem } from "@/modules/meetings/types";
import { normalizeInsights } from "@/inngest/insights";

async function resolveSpeakers(speakerIds: string[]) {
  if (speakerIds.length === 0) return [];

  const [userSpeakers, agentSpeakers] = await Promise.all([
    db.select().from(user).where(inArray(user.id, speakerIds)),
    db.select().from(agents).where(inArray(agents.id, speakerIds)),
  ]);

  return [...userSpeakers, ...agentSpeakers];
}

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      const res = await fetch(event.data.transcriptUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch transcript: ${res.status}`);
      }
      return res.text();
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const speakers = await resolveSpeakers(speakerIds);

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        return {
          ...item,
          user: {
            name: speaker?.name ?? "Unknown",
          },
        };
      });
    });

    const insights = await step.run("generate-summary", async () => {
      const { generateTextWithFallback } = await import("@/lib/ai-clients");
      const systemPrompt = `You are an expert meeting analyst. Extract the following from the transcript:
1. summary: A well-formatted Markdown summary of the meeting.
2. actionItems: A list of action items, with assignees if mentioned.
3. keyDecisions: A list of key decisions made.
4. topics: A list of main topics discussed.
5. meetingScore: A productivity score from 1-100 based on the density of decisions and action items.

You MUST respond with ONLY a valid JSON object matching this schema:
{
  "summary": "markdown string",
  "actionItems": ["item 1", "item 2"],
  "keyDecisions": ["decision 1"],
  "topics": ["topic 1"],
  "meetingScore": 85
}`;
      const promptText = "Analyze the following transcript:\n" + JSON.stringify(transcriptWithSpeakers);

      const responseText = await generateTextWithFallback(
        [{ role: "user", content: promptText }],
        systemPrompt
      );

      try {
        // Strip markdown code blocks if the LLM wraps the JSON
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return normalizeInsights(JSON.parse(cleanJson), responseText);
      } catch {
        console.error("Failed to parse AI JSON response:", responseText);
        return normalizeInsights(null, responseText);
      }
    });

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: insights.summary,
          actionItems: JSON.stringify(insights.actionItems),
          keyDecisions: JSON.stringify(insights.keyDecisions),
          topics: JSON.stringify(insights.topics),
          meetingScore: insights.meetingScore,
          // Persist the parsed transcript: Stream's hosted URL expires, the
          // database copy keeps transcripts (and chat context) working forever
          transcript: JSON.stringify(transcriptWithSpeakers),
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(meetings.id, event.data.meetingId))
    });

    await step.run("embed-transcript", async () => {
      if (!embeddingsAvailable()) {
        return { skipped: true, reason: "OPENAI_API_KEY not set" };
      }

      const [meeting] = await db
        .select({ id: meetings.id, userId: meetings.userId })
        .from(meetings)
        .where(eq(meetings.id, event.data.meetingId));

      if (!meeting) return { skipped: true, reason: "Meeting not found" };

      const lines = transcriptWithSpeakers.map(
        (item) => `${item.user.name}: ${item.text}`,
      );
      const chunks = chunkTranscriptLines(lines);
      if (chunks.length === 0) return { skipped: true, reason: "Empty transcript" };

      const embeddings = await embedTexts(chunks);

      // Idempotent across retries
      await db
        .delete(transcriptChunks)
        .where(eq(transcriptChunks.meetingId, meeting.id));

      await db.insert(transcriptChunks).values(
        chunks.map((content, i) => ({
          meetingId: meeting.id,
          userId: meeting.userId,
          chunkIndex: i,
          content,
          embedding: embeddings[i],
        })),
      );

      return { skipped: false, chunks: chunks.length };
    });

    await step.run("notify-summary-ready", async () => {
      const [meeting] = await db
        .select({ id: meetings.id, name: meetings.name, userId: meetings.userId })
        .from(meetings)
        .where(eq(meetings.id, event.data.meetingId));

      if (!meeting) return;

      await db.insert(notifications).values({
        userId: meeting.userId,
        type: "summary_ready",
        title: "Meeting summary ready",
        body: `The AI summary and insights for "${meeting.name}" are ready to view.`,
        meetingId: meeting.id,
      });

      const { sendSummaryReadyEmail } = await import("@/lib/email");
      await sendSummaryReadyEmail({
        userId: meeting.userId,
        meetingId: meeting.id,
        meetingName: meeting.name,
      });
    });
  },
);

// Maximum transcript characters included in the chat context. Keeps the
// prompt well within the model's context window even for long meetings.
const MAX_TRANSCRIPT_CONTEXT_CHARS = 12_000;

export const chatAgentResponse = inngest.createFunction(
  {
    id: "chat/agent-response",
    retries: 1,
    // Cost/abuse guard: at most 10 AI replies per channel per minute;
    // excess messages are dropped rather than queued
    rateLimit: {
      limit: 10,
      period: "1m",
      key: "event.data.channelId",
    },
  },
  { event: "chat/agent-response" },
  async ({ event, step }) => {
    const { channelId, messageText, senderId } = event.data as {
      channelId: string;
      messageText: string;
      senderId: string;
    };

    const context = await step.run("load-meeting-context", async () => {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

      if (!existingMeeting) {
        return null;
      }

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, existingMeeting.agentId));

      if (!existingAgent) {
        return null;
      }

      return { meeting: existingMeeting, agent: existingAgent };
    });

    if (!context) {
      return { skipped: true, reason: "Meeting or agent not found" };
    }

    // Never respond to the agent's own messages - that would loop forever.
    if (senderId === context.agent.id) {
      return { skipped: true, reason: "Message sent by the agent itself" };
    }

    const transcriptExcerpt = await step.run("fetch-transcript-context", async () => {
      // Preferred: RAG - retrieve the chunks most relevant to the question
      if (embeddingsAvailable()) {
        try {
          const questionEmbedding = await embedText(messageText);

          if (questionEmbedding) {
            const similarity = sql<number>`1 - (${cosineDistance(
              transcriptChunks.embedding,
              questionEmbedding,
            )})`;

            const relevantChunks = await db
              .select({
                content: transcriptChunks.content,
                similarity,
              })
              .from(transcriptChunks)
              .where(eq(transcriptChunks.meetingId, context.meeting.id))
              .orderBy(desc(similarity))
              .limit(6);

            if (relevantChunks.length > 0) {
              return relevantChunks
                .map((chunk) => chunk.content)
                .join("\n---\n");
            }
          }
        } catch (error) {
          console.error("[Chat] RAG retrieval failed, falling back to raw transcript:", error);
        }
      }

      try {
        let lines: string[] = [];

        if (context.meeting.transcript) {
          // Preferred: the persisted transcript (already has speaker names)
          const items = JSON.parse(context.meeting.transcript) as (StreamTranscriptItem & {
            user?: { name?: string };
          })[];
          lines = items.map((item) => `${item.user?.name ?? "Unknown"}: ${item.text}`);
        } else if (context.meeting.transcriptUrl) {
          // Legacy meetings processed before transcripts were persisted
          const raw = await fetch(context.meeting.transcriptUrl).then((res) => res.text());
          const items = JSONL.parse<StreamTranscriptItem>(raw);

          const speakerIds = [...new Set(items.map((item) => item.speaker_id))];
          const speakers = await resolveSpeakers(speakerIds);

          lines = items.map((item) => {
            const speaker = speakers.find((s) => s.id === item.speaker_id);
            return `${speaker?.name ?? "Unknown"}: ${item.text}`;
          });
        }

        let text = lines.join("\n");
        if (text.length > MAX_TRANSCRIPT_CONTEXT_CHARS) {
          text = "...\n" + text.slice(-MAX_TRANSCRIPT_CONTEXT_CHARS);
        }
        return text;
      } catch (error) {
        console.error("[Chat] Failed to load transcript context:", error);
        return "";
      }
    });

    // Best-effort typing indicator while the reply is generated
    await step.run("typing-start", async () => {
      try {
        const channel = streamChat.channel("messaging", channelId);
        await channel.sendEvent({
          type: "typing.start",
          user_id: context.agent.id,
        } as Parameters<typeof channel.sendEvent>[0]);
      } catch {
        // non-critical
      }
    });

    const responseText = await step.run("generate-response", async () => {
      const { generateChatResponse } = await import("@/lib/ai-clients");
      const { meeting, agent } = context;

      const instructions = `You are an AI assistant helping the user revisit a recently completed meeting.

Below is a summary of the meeting, generated from the transcript:

${meeting.summary}
${transcriptExcerpt ? `\nTranscript context (excerpts most relevant to the user's question, or the most recent portion of the meeting):\n\n${transcriptExcerpt}\n` : ""}
The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:

${agent.instructions}

The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
Base your answers on the meeting summary and transcript above. Quote the transcript when the user asks what was actually said.

You have access to a web_search tool. Use it when the user asks about external facts, current events, or anything not covered by the meeting itself. Do not use it for questions the meeting context already answers.

If neither the meeting context nor a web search can answer a question, politely say so.

Be concise, helpful, and accurate.`;

      const channel = streamChat.channel("messaging", channelId);
      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map((message) => ({
          role: (message.user?.id === agent.id ? "assistant" : "user") as
            | "assistant"
            | "user",
          content: message.text || "",
        }));

      return generateChatResponse(
        [...previousMessages, { role: "user", content: messageText }],
        instructions
      );
    });

    await step.run("send-response", async () => {
      const { agent } = context;

      const avatarUrl = generateAvatarUri({
        seed: agent.name,
        variant: "botttsNeutral",
      });

      await streamChat.upsertUser({
        id: agent.id,
        name: agent.name,
        image: avatarUrl,
      });

      const channel = streamChat.channel("messaging", channelId);

      try {
        await channel.sendEvent({
          type: "typing.stop",
          user_id: agent.id,
        } as Parameters<typeof channel.sendEvent>[0]);
      } catch {
        // non-critical
      }

      await channel.sendMessage({
        text: responseText,
        user: {
          id: agent.id,
          name: agent.name,
          image: avatarUrl,
        },
      });
    });

    return { skipped: false };
  },
);
