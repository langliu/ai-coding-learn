import { ChatOpenAI } from '@langchain/openai'
import { createAgent, tool } from 'langchain'
import { z } from 'zod'

import { getRequiredEnv } from './utils/env.ts'

const getWeather = tool((input) => `The weather in ${input.city} is sunny.`, {
  name: 'getWeather',
  description: 'Get the weather in a city.',
  schema: z.object({
    city: z.string().describe('The city to get the weather for.'),
  }),
})
console.log('process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY)
const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: getRequiredEnv('OPENAI_API_KEY'),
  configuration: {
    baseURL: getRequiredEnv('OPENAI_BASE_URL'),
  },
})
const agent = createAgent({
  tools: [getWeather],
  model,
})

const response = await agent.invoke({
  messages: [{ role: 'user', content: 'What is the weather like in London?' }],
})

console.log(response)
