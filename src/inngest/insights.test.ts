import { describe, expect, it } from "vitest";

import { normalizeInsights } from "./insights";

describe("normalizeInsights", () => {
  it("normalizes a well-formed LLM response", () => {
    const result = normalizeInsights(
      {
        summary: "# Recap",
        actionItems: ["Do X", "Do Y"],
        keyDecisions: ["Chose A"],
        topics: ["Planning"],
        meetingScore: 85,
      },
      "fallback",
    );

    expect(result).toEqual({
      summary: "# Recap",
      actionItems: [
        { text: "Do X", done: false },
        { text: "Do Y", done: false },
      ],
      keyDecisions: ["Chose A"],
      topics: ["Planning"],
      meetingScore: 85,
    });
  });

  it("falls back to raw text when summary is missing or blank", () => {
    expect(normalizeInsights({}, "raw response").summary).toBe("raw response");
    expect(normalizeInsights({ summary: "   " }, "raw response").summary).toBe("raw response");
  });

  it("survives completely wrong shapes", () => {
    const result = normalizeInsights("nonsense", "fallback");
    expect(result.summary).toBe("fallback");
    expect(result.actionItems).toEqual([]);
    expect(result.keyDecisions).toEqual([]);
    expect(result.topics).toEqual([]);
    expect(result.meetingScore).toBe(0);
  });

  it("accepts action items already shaped as objects", () => {
    const result = normalizeInsights(
      { actionItems: [{ text: "Ship it", done: true }, "Plain item"] },
      "fallback",
    );
    // done is always reset to false at generation time
    expect(result.actionItems).toEqual([
      { text: "Ship it", done: false },
      { text: "Plain item", done: false },
    ]);
  });

  it("clamps and sanitizes the score", () => {
    expect(normalizeInsights({ meetingScore: 250 }, "f").meetingScore).toBe(100);
    expect(normalizeInsights({ meetingScore: -5 }, "f").meetingScore).toBe(0);
    expect(normalizeInsights({ meetingScore: "87" }, "f").meetingScore).toBe(87);
    expect(normalizeInsights({ meetingScore: "high" }, "f").meetingScore).toBe(0);
  });
});
