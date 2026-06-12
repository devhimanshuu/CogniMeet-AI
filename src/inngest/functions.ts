import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";

import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";

import { StreamTranscriptItem } from "@/modules/meetings/types";

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
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
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
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
        return JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse AI JSON response:", responseText);
        return {
          summary: responseText, // Fallback to raw text
          actionItems: [],
          keyDecisions: [],
          topics: [],
          meetingScore: 0
        };
      }
    });

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: insights.summary as string,
          actionItems: JSON.stringify(insights.actionItems),
          keyDecisions: JSON.stringify(insights.keyDecisions),
          topics: JSON.stringify(insights.topics),
          meetingScore: insights.meetingScore as number,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId))
    })
  },
);

