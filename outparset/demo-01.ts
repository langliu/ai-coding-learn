import { ChatDeepSeek } from "@langchain/deepseek";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from '@langchain/core/output_parsers'

console.log(Deno.env.get("DEEPSEEK_API_KEY"))
const model = new ChatDeepSeek({
  apiKey: Deno.env.get("DEEPSEEK_API_KEY")!,
  model: "deepseek-chat",
}).pipe(new StringOutputParser());

const result = await model.invoke([
  new HumanMessage("给我讲一个笑话")
])

console.log(result)
