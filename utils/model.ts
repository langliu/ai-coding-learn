import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'

export const model = new ChatOpenAI({
  apiKey: Bun.env.OPENAI_API_KEY,
  model: Bun.env.OPENAI_MODEL,
  configuration: {
    baseURL: Bun.env.OPENAI_API_BASE_URL,
  },
})

export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_EMBEDDING_MODEL,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE_URL,
  },
})
