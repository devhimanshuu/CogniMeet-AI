import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/index.mjs";

import { searchWeb } from "@/lib/tavily";

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const openRouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateTextWithFallback(
  messages: ChatCompletionMessageParam[],
  systemPrompt?: string,
): Promise<string> {
  const fullMessages = systemPrompt
    ? ([{ role: "system", content: systemPrompt }, ...messages] as ChatCompletionMessageParam[])
    : messages;

  try {
    // Primary: Groq (llama-3.3-70b-versatile)
    console.log("[AI Fallback] Attempting primary: Groq...");
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: fullMessages,
    });
    return response.choices[0]?.message?.content || "";
  } catch (groqError) {
    console.error("[AI Fallback] Groq failed, attempting Fallback 1: OpenRouter...", groqError);
    
    try {
      // Fallback 1: OpenRouter
      const response = await openRouterClient.chat.completions.create({
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: fullMessages,
      });
      return response.choices[0]?.message?.content || "";
    } catch (openRouterError) {
      console.error("[AI Fallback] OpenRouter failed, attempting Fallback 2: HuggingFace...", openRouterError);
      
      try {
        // Fallback 2: Hugging Face
        // Simple mapping to string since Hf text generation doesn't use the standard messages array natively
        const combinedText = fullMessages.map((m) => `${m.role}: ${m.content}`).join("\n");
        const response = await hf.textGeneration({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          inputs: combinedText,
          parameters: { max_new_tokens: 500 },
        });
        return response.generated_text || "";
      } catch (hfError) {
        console.error("[AI Fallback] HuggingFace failed. All fallbacks exhausted.", hfError);
        return "I am currently experiencing high volume and my AI services are unavailable. Please try again later.";
      }
    }
  }
}

const webSearchTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "web_search",
    description:
      "Search the web for up-to-date or factual information that is not covered by the meeting context. Use it for current events, external facts, comparisons, or anything the user asks about that happened outside the meeting.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
      required: ["query"],
    },
  },
};

const MAX_TOOL_ROUNDS = 2;

/**
 * Chat generation where the model itself decides whether to call the
 * Tavily web-search tool. Falls back to the plain fallback chain (no tools)
 * if the tool-capable primary provider fails.
 */
export async function generateChatResponse(
  messages: ChatCompletionMessageParam[],
  systemPrompt?: string,
): Promise<string> {
  const fullMessages: ChatCompletionMessageParam[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : [...messages];

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: fullMessages,
        // Skip tools on the last round to force a final text answer
        tools: round < MAX_TOOL_ROUNDS ? [webSearchTool] : undefined,
      });

      const message = response.choices[0]?.message;

      if (!message?.tool_calls?.length) {
        return message?.content || "";
      }

      fullMessages.push(message);

      for (const toolCall of message.tool_calls) {
        let resultText = "No results found.";

        if (toolCall.function.name === "web_search") {
          try {
            const { query } = JSON.parse(toolCall.function.arguments);
            const results = await searchWeb(query, 3);
            if (results.results.length > 0) {
              resultText = results.results
                .map((r) => `${r.title} (${r.url}): ${r.content.substring(0, 300)}`)
                .join("\n");
              if (results.answer) {
                resultText += `\n\nSummary: ${results.answer}`;
              }
            }
          } catch (error) {
            console.error("[AI Tools] web_search execution failed:", error);
            resultText = "Web search is currently unavailable.";
          }
        }

        fullMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: resultText,
        });
      }
    }

    // Should be unreachable: the last round runs without tools
    return generateTextWithFallback(messages, systemPrompt);
  } catch (error) {
    console.error("[AI Tools] Tool-calling generation failed, falling back to plain chain:", error);
    return generateTextWithFallback(messages, systemPrompt);
  }
}
