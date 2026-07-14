export interface ActionItem {
  text: string;
  done: boolean;
}

/**
 * Action items are stored as a JSON string. Older rows contain an array of
 * strings, newer rows an array of { text, done } objects. Normalize both
 * shapes and never throw on malformed data.
 */
export function parseActionItems(raw: string | null | undefined): ActionItem[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (typeof item === "string") {
          return { text: item, done: false };
        }
        if (item && typeof item === "object" && typeof item.text === "string") {
          return { text: item.text, done: Boolean(item.done) };
        }
        return null;
      })
      .filter((item): item is ActionItem => item !== null);
  } catch {
    return [];
  }
}

export function parseStringList(raw: string | null | undefined): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}
