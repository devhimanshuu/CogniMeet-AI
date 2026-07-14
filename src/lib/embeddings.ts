import "server-only";

import OpenAI from "openai";

export const EMBEDDING_DIMENSIONS = 1536;
const EMBEDDING_MODEL = "text-embedding-3-small";
const BATCH_SIZE = 96;

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

/** Semantic search / RAG requires OpenAI embeddings; degrade gracefully without the key. */
export function embeddingsAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const openai = getClient();
  if (!openai || texts.length === 0) return [];

  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });
    for (const item of response.data) {
      embeddings.push(item.embedding);
    }
  }

  return embeddings;
}

export async function embedText(text: string): Promise<number[] | null> {
  const [embedding] = await embedTexts([text]);
  return embedding ?? null;
}

const MAX_CHUNK_CHARS = 1000;

/**
 * Group transcript lines ("Speaker: text") into chunks of roughly
 * MAX_CHUNK_CHARS, never splitting a line.
 */
export function chunkTranscriptLines(lines: string[]): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const line of lines) {
    if (current && current.length + line.length + 1 > MAX_CHUNK_CHARS) {
      chunks.push(current);
      current = "";
    }
    current = current ? `${current}\n${line}` : line;
  }

  if (current) chunks.push(current);

  return chunks;
}
