import { CommaSeparatedListOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { model } from "../utils/model.ts";

const parser = new CommaSeparatedListOutputParser()

console.log(parser.getFormatInstructions())
const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个内容运营助手。'],
  [
    'human',
    '请为 {topic} 生成 5 个标签。\n{format_instructions}',
  ],
])

const chain = prompt.pipe(model).pipe(parser)
const result = await chain.invoke({
  topic: '人工智能',
  format_instructions: parser.getFormatInstructions(),
})

console.log(result)
