import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from "@langchain/core/prompts";

console.log(Deno.env.get("DEEPSEEK_API_KEY"))

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: '用户问题的答案',
  evidence: '支持答案的证据，可以是文本、链接等',
  confidence: '问题答案的可信度评分，格式是百分数',
})

console.log(parser.getFormatInstructions())
const prompt = PromptTemplate.fromTemplate("尽可能的回答用的问题 \n{ins} \n{question}")

const model = new ChatOpenAI({
  apiKey: Deno.env.get("DEEPSEEK_API_KEY")!,
  model: "deepseek-chat",
  configuration: {
    baseURL: Deno.env.get("OPENAI_BASE_URL")!,
  }
}).pipe(new StringOutputParser());

const chain = prompt.pipe(model).pipe(parser)
const result = await chain.invoke({
  ins: parser.getFormatInstructions(),
  question: "什么是 LangChain？"
})

console.log(result)
