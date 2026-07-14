import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

/**
 * Best-effort summary-ready email. Requires RESEND_API_KEY (and optionally
 * EMAIL_FROM); silently no-ops when not configured so the notification
 * pipeline never fails on email delivery.
 */
export async function sendSummaryReadyEmail(params: {
  userId: string;
  meetingId: string;
  meetingName: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const [recipient] = await db
      .select({ email: user.email, name: user.name })
      .from(user)
      .where(eq(user.id, params.userId));

    // Skip placeholder addresses created for users without an email
    if (!recipient?.email || recipient.email.endsWith("@users.cognimeet.local")) {
      return;
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const meetingUrl = `${appUrl}/meetings/${params.meetingId}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "CogniMeet <onboarding@resend.dev>",
      to: recipient.email,
      subject: `Your summary for "${params.meetingName}" is ready`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #10b981;">Meeting summary ready</h2>
          <p>Hi ${recipient.name},</p>
          <p>The AI summary, action items, and insights for
            <strong>${params.meetingName}</strong> are ready to view.</p>
          <p style="margin: 24px 0;">
            <a href="${meetingUrl}"
               style="background: #10b981; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
              View summary
            </a>
          </p>
          <p style="color: #64748b; font-size: 12px;">CogniMeet.AI — AI-powered meeting intelligence</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[Email] Failed to send summary-ready email:", error);
  }
}
