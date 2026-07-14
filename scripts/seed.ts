/**
 * Demo data seeder.
 *
 * Populates the database with agents and completed meetings (summaries,
 * action items, decisions, scores, transcripts) for an existing user so the
 * dashboard, insights, and briefing views are explorable without running a
 * real call.
 *
 * Usage:
 *   npm run seed                       # seeds the first user in the DB
 *   npm run seed -- --email you@x.com  # seeds a specific user
 */
import "dotenv/config";
import { eq } from "drizzle-orm";

import { db } from "../src/db";
import { agents, meetings, notifications, user } from "../src/db/schema";

const DAY = 24 * 60 * 60 * 1000;

const demoAgents = [
  {
    name: "Scrum Master Sam",
    instructions:
      "You are an experienced Scrum Master. Keep discussions focused on sprint goals, surface blockers early, and make sure every action item has an owner and a deadline.",
  },
  {
    name: "Product Strategist Pia",
    instructions:
      "You are a sharp product manager. Push for user-impact framing, question scope creep, and summarize trade-offs crisply.",
  },
  {
    name: "Tech Architect Alex",
    instructions:
      "You are a pragmatic software architect. Evaluate technical proposals for scalability, cost, and maintainability, and call out risky shortcuts.",
  },
];

const demoMeetings = [
  {
    name: "Sprint 24 Planning",
    daysAgo: 12,
    durationMin: 42,
    score: 82,
    topics: ["Sprint scope", "Velocity review", "Carry-over stories"],
    keyDecisions: [
      "Cut the reporting epic from Sprint 24 to protect the release date",
      "Adopt story-point re-estimation for carried-over tickets",
    ],
    actionItems: [
      { text: "Riya to split the payments story into two smaller tickets", done: true },
      { text: "Update the sprint board with new estimates by Wednesday", done: false },
      { text: "Schedule a mid-sprint checkpoint for Friday", done: false },
    ],
    summary:
      "## Sprint 24 Planning\n\nThe team reviewed velocity from the last three sprints (avg 34 points) and agreed to commit to 32 points. The reporting epic was cut to protect the release date.\n\n### Highlights\n- Payments story deemed too large; will be split\n- Two carry-over tickets re-estimated\n- Mid-sprint checkpoint added to catch risk earlier",
  },
  {
    name: "Q3 Roadmap Review",
    daysAgo: 9,
    durationMin: 55,
    score: 74,
    topics: ["Q3 priorities", "Customer feedback themes", "Competitive analysis"],
    keyDecisions: [
      "Prioritize mobile onboarding revamp over the integrations marketplace",
      "Run pricing experiment in two mid-tier segments",
    ],
    actionItems: [
      { text: "Draft PRD for mobile onboarding revamp", done: true },
      { text: "Compile churn-interview themes into a one-pager", done: true },
      { text: "Set up pricing experiment cohorts in analytics", done: false },
    ],
    summary:
      "## Q3 Roadmap Review\n\nCustomer feedback shows onboarding friction is the top churn driver. The team re-prioritized the mobile onboarding revamp ahead of the integrations marketplace and approved a limited pricing experiment.",
  },
  {
    name: "Architecture Sync: Event Pipeline",
    daysAgo: 6,
    durationMin: 38,
    score: 88,
    topics: ["Event pipeline", "Queue technology choice", "Cost projection"],
    keyDecisions: [
      "Use managed Kafka over self-hosted for the event pipeline",
      "Set a 30-day retention policy for raw events",
    ],
    actionItems: [
      { text: "Benchmark managed Kafka throughput with production-shaped payloads", done: true },
      { text: "Write ADR documenting the queue decision", done: false },
    ],
    summary:
      "## Architecture Sync: Event Pipeline\n\nCompared managed Kafka vs self-hosted vs SQS for the new event pipeline. Managed Kafka won on operational overhead despite ~15% higher cost. Raw event retention capped at 30 days to control storage spend.",
  },
  {
    name: "Weekly Standup Retro",
    daysAgo: 3,
    durationMin: 25,
    score: 65,
    topics: ["Process friction", "Deploy cadence", "On-call load"],
    keyDecisions: ["Move deploys to twice weekly", "Rotate on-call weekly instead of biweekly"],
    actionItems: [
      { text: "Update the deploy calendar and notify the team", done: false },
      { text: "Document the new on-call rotation in the runbook", done: false },
    ],
    summary:
      "## Weekly Standup Retro\n\nThe team flagged deploy bottlenecks and uneven on-call load. Deploys move to a twice-weekly cadence and on-call now rotates weekly.",
  },
  {
    name: "Customer Escalation Debrief",
    daysAgo: 1,
    durationMin: 31,
    score: 79,
    topics: ["Incident timeline", "Root cause", "Customer communication"],
    keyDecisions: [
      "Add rate limiting to the export endpoint",
      "Create a customer-facing status page",
    ],
    actionItems: [
      { text: "Ship rate limiting on /export within two weeks", done: false },
      { text: "Draft status-page copy for legal review", done: false },
      { text: "Send follow-up summary to the affected customer", done: true },
    ],
    summary:
      "## Customer Escalation Debrief\n\nAn unthrottled export endpoint let a single customer script degrade the API for 40 minutes. Rate limiting and a public status page were approved as immediate follow-ups.",
  },
];

function buildTranscript(meetingName: string, userName: string, agentName: string, userId: string, agentId: string) {
  const lines = [
    { speaker_id: userId, name: userName, text: `Alright, let's get started with ${meetingName}.` },
    { speaker_id: agentId, name: agentName, text: "Sounds good. I'll keep track of decisions and action items as we go." },
    { speaker_id: userId, name: userName, text: "First, a quick recap of where we left off last time." },
    { speaker_id: agentId, name: agentName, text: "Noted. I've logged the recap as context for the summary." },
    { speaker_id: userId, name: userName, text: "Let's make sure every follow-up has a clear owner before we wrap." },
    { speaker_id: agentId, name: agentName, text: "Agreed - I'll flag any action item that doesn't have an assignee." },
  ];

  return lines.map((line, i) => ({
    speaker_id: line.speaker_id,
    type: "speech",
    text: line.text,
    start_ts: i * 15_000,
    stop_ts: i * 15_000 + 12_000,
    user: { name: line.name },
  }));
}

async function main() {
  const emailFlagIndex = process.argv.indexOf("--email");
  const email = emailFlagIndex !== -1 ? process.argv[emailFlagIndex + 1] : undefined;

  const [targetUser] = email
    ? await db.select().from(user).where(eq(user.email, email))
    : await db.select().from(user).limit(1);

  if (!targetUser) {
    console.error(
      email
        ? `No user found with email ${email}. Sign in to the app once first.`
        : "No users in the database. Sign in to the app once first.",
    );
    process.exit(1);
  }

  console.log(`Seeding demo data for ${targetUser.name} <${targetUser.email}>...`);

  const createdAgents = await db
    .insert(agents)
    .values(demoAgents.map((agent) => ({ ...agent, userId: targetUser.id })))
    .returning();

  console.log(`Created ${createdAgents.length} agents.`);

  const now = Date.now();

  const createdMeetings = await db
    .insert(meetings)
    .values(
      demoMeetings.map((meeting, i) => {
        const agent = createdAgents[i % createdAgents.length];
        const startedAt = new Date(now - meeting.daysAgo * DAY);
        const endedAt = new Date(startedAt.getTime() + meeting.durationMin * 60_000);

        return {
          name: meeting.name,
          userId: targetUser.id,
          agentId: agent.id,
          status: "completed" as const,
          startedAt,
          endedAt,
          summary: meeting.summary,
          actionItems: JSON.stringify(meeting.actionItems),
          keyDecisions: JSON.stringify(meeting.keyDecisions),
          topics: JSON.stringify(meeting.topics),
          meetingScore: meeting.score,
          transcript: JSON.stringify(
            buildTranscript(meeting.name, targetUser.name, agent.name, targetUser.id, agent.id),
          ),
          createdAt: startedAt,
          updatedAt: endedAt,
        };
      }),
    )
    .returning();

  console.log(`Created ${createdMeetings.length} completed meetings.`);

  await db.insert(notifications).values(
    createdMeetings.slice(0, 2).map((meeting) => ({
      userId: targetUser.id,
      type: "summary_ready",
      title: "Meeting summary ready",
      body: `The AI summary and insights for "${meeting.name}" are ready to view.`,
      meetingId: meeting.id,
    })),
  );

  console.log("Created sample notifications.");
  console.log("Done. Open /dashboard to explore the demo data.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
