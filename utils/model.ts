import { ChatOpenAI } from '@langchain/openai'

import { getRequiredEnv } from './env.ts'

export const model = new ChatOpenAI({
  apiKey: getRequiredEnv('DEEPSEEK_API_KEY'),
  model: 'deepseek-chat',
  configuration: {
    baseURL: getRequiredEnv('OPENAI_BASE_URL'),
  },
})
