import { TextLoader } from '@langchain/classic/document_loaders/fs/text'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { ChromaClient } from 'chromadb'


const loader = new TextLoader('data/kong.txt')
const docs = await loader.load()
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_EMBEDDING_MODEL,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE_URL,
  },
})

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
})

const splitDocs = await splitter.splitDocuments(docs)
const client = new ChromaClient({
  host: 'localhost',
  port: 8000,
  ssl: false
})

const collection = await client.getOrCreateCollection({
  name: 'kongyiji',
  metadata: { description: '孔乙己' },
})

await collection.add({
  documents: splitDocs.map((doc) => doc.pageContent),
  ids: splitDocs.map((_, index) => index.toString()),
  embeddings: await embeddings.embedDocuments(splitDocs.map((doc) => doc.pageContent)),
})

// OpenAI 模型的 1536 维 embedding， Chroma 内置 embedding（384 维）
const queryEmbedding = await embeddings.embedQuery('茴香豆是做什么用的')
const results = await collection.query({
  queryEmbeddings: [queryEmbedding],
  nResults: 2
})
console.log(results)

