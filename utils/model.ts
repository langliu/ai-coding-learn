import { OpenAIEmbeddings } from '@langchain/openai'
import { initChatModel } from 'langchain'

const openAIApiKey = Bun.env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY
const openAIModel = Bun.env.OPENAI_MODEL ?? process.env.OPENAI_MODEL
const openAIBaseURL =
  Bun.env.OPENAI_BASE_URL ??
  process.env.OPENAI_BASE_URL ??
  Bun.env.OPENAI_API_BASE_URL ??
  process.env.OPENAI_API_BASE_URL

export const chatModel = await initChatModel(openAIModel!, {
  modelProvider: 'openai',
  temperature: 0.5,
  apiKey: openAIApiKey,
  configuration: {
    baseURL: openAIBaseURL,
  },
})

export const model = chatModel

export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: openAIApiKey,
  model: Bun.env.OPENAI_EMBEDDING_MODEL ?? process.env.OPENAI_EMBEDDING_MODEL,
  configuration: {
    baseURL: openAIBaseURL,
  },
})
