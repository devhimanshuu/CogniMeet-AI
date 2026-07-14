import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  MessageNewEvent,
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing")),
        )
      );

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Bring the AI agent into the live call. Stream bridges the OpenAI
    // Realtime session server-side, so the agent stays in the call after
    // this request finishes.
    const call = streamVideo.video.call("default", meetingId);
    let agentStatus: "joined" | "unavailable" = "unavailable";

    if (process.env.OPENAI_API_KEY) {
      try {
        const realtimeClient = await streamVideo.video.connectOpenAi({
          call,
          openAiApiKey: process.env.OPENAI_API_KEY,
          agentUserId: existingAgent.id,
        });

        realtimeClient.updateSession({
          instructions: existingAgent.instructions,
        });

        agentStatus = "joined";
      } catch (error) {
        // The meeting must still work as a plain recorded call even if the
        // live agent fails to connect.
        console.error("[Webhook] Failed to connect live AI agent:", error);
      }
    } else {
      console.warn(
        "[Webhook] OPENAI_API_KEY is not set - the AI agent will not join the live call."
      );
    }

    // Surface the agent's status to participants via call custom data
    try {
      await call.update({
        custom: {
          ...event.call.custom,
          agentStatus,
          agentName: existingAgent.name,
        },
      });
    } catch (error) {
      console.error("[Webhook] Failed to update call custom data:", error);
    }

  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    try {
      const call = streamVideo.video.call("default", meetingId);
      const callState = await call.get();
      const participants = callState.call.session?.participants ?? [];

      // End the call once no humans remain (the AI agent may still be
      // "present" as a participant).
      const humanParticipants = participants.filter(
        (participant) => participant.user_session_id !== event.participant.user_session_id
      );

      if (humanParticipants.length <= 1) {
        await call.end();
      }
    } catch (error) {
      // The call may already be over; don't 500 or Stream will retry.
      console.error("[Webhook] Failed to check/end call on participant leave:", error);
    }
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({
        status: "processing",
        endedAt: new Date(),
      })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    const [updatedMeeting] = await db
      .update(meetings)
      .set({
        transcriptUrl: event.call_transcription.url,
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updatedMeeting.id,
        transcriptUrl: updatedMeeting.transcriptUrl,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1]; // call_cid is formatted as "type:id"

    await db
      .update(meetings)
      .set({
        recordingUrl: event.call_recording.url,
      })
      .where(eq(meetings.id, meetingId));
  } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;

    const userId = event.user?.id;
    const channelId = event.channel_id;
    const text = event.message?.text;

    if (!userId || !channelId || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generating the AI reply can take many seconds (LLM + optional web
    // search), which risks webhook timeouts and duplicate replies on
    // retries. Offload it to Inngest and acknowledge immediately.
    await inngest.send({
      name: "chat/agent-response",
      data: {
        channelId,
        messageText: text,
        senderId: userId,
      },
    });
  }

  return NextResponse.json({ status: "ok" });
}
