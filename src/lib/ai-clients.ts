import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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
