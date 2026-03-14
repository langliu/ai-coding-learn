import { JsonOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'

import { model } from '../utils/model.ts'

const outputParser = new JsonOutputParser()

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个技术文章分析助手。'],
  [
    'human',
    `请分析下面的主题，并按要求返回结果：

主题：{topic}

{format_instructions}`,
  ],
])

const chain = prompt.pipe(model).pipe(outputParser)
const result = await chain.invoke({
  topic: 'LangChain OutputParser',
  format_instructions: `${outputParser.getFormatInstructions()}

请只返回 JSON，不要附加解释，不要使用 Markdown 代码块。
对象包含以下字段：
- title: 字符串
- summary: 字符串
- tags: 字符串数组
- score: 0 到 100 的数字`,
})

console.log(result)
