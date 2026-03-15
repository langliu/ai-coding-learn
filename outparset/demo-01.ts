import { HumanMessage } from '@langchain/core/messages'
import { StringOutputParser } from '@langchain/core/output_parsers'

import { model } from '../utils/model.ts'

console.log(process.env.DEEPSEEK_API_KEY)
const chain = model.pipe(new StringOutputParser())

const result = await chain.invoke([new HumanMessage('给我讲一个笑话')])

console.log(result)
