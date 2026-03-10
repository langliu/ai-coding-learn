import { ChatDeepSeek } from "@langchain/deepseek";
import { HumanMessage } from "@langchain/core/messages";

console.log(Deno.env.get("DEEPSEEK_API_KEY"))
const model = new ChatDeepSeek({
  apiKey: Deno.env.get("DEEPSEEK_API_KEY")!,
  model: "deepseek-chat",
});

await model.invoke([
    new HumanMessage("Tell me a joke")
])

