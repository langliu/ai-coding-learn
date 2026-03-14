import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'

import { model } from '../utils/model.ts'

const sechema = z.object({
  answer: z.string().describe('用户问题的答案'),
  evidence: z.string().describe('支持答案的证据，可以是文本、链接等'),
  confidence: z.number().min(0).max(100).describe('问题答案的可信度评分，格式是百分数'),
})

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: '用户问题的答案',
  evidence: '支持答案的证据，可以是文本、链接等',
  confidence: '问题答案的可信度评分，格式是百分数',
})
const fixParser = OutputFixingParser.fromLLM(model, parser)

const prompt = PromptTemplate.fromTemplate('尽可能的回答用的问题 \n{ins} \n{question}')

const chain = prompt.pipe(model).pipe(parser)
const result = await chain.invoke({
  ins: parser.getFormatInstructions(),
  question: '什么是 LangChain？',
})

console.log(result)
