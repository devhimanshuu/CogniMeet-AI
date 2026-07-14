import { describe, expect, it } from "vitest";

import { parseActionItems, parseStringList } from "./utils";

describe("parseActionItems", () => {
  it("returns empty array for null/undefined/empty", () => {
    expect(parseActionItems(null)).toEqual([]);
    expect(parseActionItems(undefined)).toEqual([]);
    expect(parseActionItems("")).toEqual([]);
  });

  it("returns empty array for malformed JSON", () => {
    expect(parseActionItems("not json {")).toEqual([]);
  });

  it("returns empty array for non-array JSON", () => {
    expect(parseActionItems('{"a":1}')).toEqual([]);
    expect(parseActionItems('"just a string"')).toEqual([]);
  });

  it("parses legacy string arrays with done=false", () => {
    expect(parseActionItems('["Send report","Book room"]')).toEqual([
      { text: "Send report", done: false },
      { text: "Book room", done: false },
    ]);
  });

  it("parses object arrays and preserves done state", () => {
    expect(
      parseActionItems('[{"text":"Ship it","done":true},{"text":"Test it","done":false}]'),
    ).toEqual([
      { text: "Ship it", done: true },
      { text: "Test it", done: false },
    ]);
  });

  it("drops entries with no usable text", () => {
    expect(parseActionItems('[42, null, {"done":true}, "keep me"]')).toEqual([
      { text: "keep me", done: false },
    ]);
  });
});

describe("parseStringList", () => {
  it("returns empty array for null and malformed input", () => {
    expect(parseStringList(null)).toEqual([]);
    expect(parseStringList("oops[")).toEqual([]);
  });

  it("keeps only strings", () => {
    expect(parseStringList('["a", 1, null, "b"]')).toEqual(["a", "b"]);
  });
});
