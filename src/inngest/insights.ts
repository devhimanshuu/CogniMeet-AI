export interface MeetingInsights {
  summary: string;
  actionItems: { text: string; done: boolean }[];
  keyDecisions: string[];
  topics: string[];
  meetingScore: number;
}

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          typeof item === "string"
            ? item
            : item && typeof item === "object" && "text" in item
              ? String((item as { text: unknown }).text)
              : null
        )
        .filter((item): item is string => Boolean(item))
    : [];

/**
 * Normalize whatever shape the LLM returned into a safe MeetingInsights.
 * Never throws; falls back to the raw response text as the summary.
 */
export function normalizeInsights(raw: unknown, fallbackSummary: string): MeetingInsights {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const score = Number(data.meetingScore);

  return {
    summary: typeof data.summary === "string" && data.summary.trim() !== ""
      ? data.summary
      : fallbackSummary,
    actionItems: toStringArray(data.actionItems).map((text) => ({ text, done: false })),
    keyDecisions: toStringArray(data.keyDecisions),
    topics: toStringArray(data.topics),
    meetingScore: Number.isFinite(score) ? Math.min(100, Math.max(0, Math.round(score))) : 0,
  };
}
