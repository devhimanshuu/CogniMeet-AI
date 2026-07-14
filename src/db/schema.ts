import { nanoid } from "nanoid";
import { pgTable, text, timestamp, boolean, pgEnum, integer, vector, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});


export const agents = pgTable("agents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instructions: text("instructions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const meetingStatus = pgEnum("meeting_status", [
  "upcoming",
  "active",
  "completed",
  "processing",
  "cancelled"
]);

export const meetings = pgTable("meetings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  status: meetingStatus("status").notNull().default("upcoming"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  transcriptUrl: text("transcript_url"),
  // Stream's transcript URLs expire; we persist the parsed transcript
  // (JSON array of items with speaker names) so old meetings keep working.
  transcript: text("transcript"),
  recordingUrl: text("recording_url"),
  summary: text("summary"),
  actionItems: text("action_items"), // Stored as JSON string
  keyDecisions: text("key_decisions"), // Stored as JSON string
  topics: text("topics"), // Stored as JSON string
  meetingScore: integer("meeting_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Transcript chunks embedded for semantic search (pgvector). Dimensions
// match OpenAI text-embedding-3-small.
export const transcriptChunks = pgTable(
  "transcript_chunks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    meetingId: text("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    chunkIndex: integer("chunk_index").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("transcript_chunks_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
    index("transcript_chunks_meeting_id_idx").on(table.meetingId),
  ],
);

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // e.g. "summary_ready"
  title: text("title").notNull(),
  body: text("body"),
  meetingId: text("meeting_id").references(() => meetings.id, {
    onDelete: "cascade",
  }),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});