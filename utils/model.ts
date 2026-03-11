import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  apiKey: Deno.env.get("DEEPSEEK_API_KEY")!,
  model: "deepseek-chat",
  configuration: {
    baseURL: Deno.env.get("OPENAI_BASE_URL")!,
  }
})
