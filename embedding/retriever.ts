import { TextLoader } from '@langchain/classic/document_loaders/fs/text'
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'


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
const vectorStore = new MemoryVectorStore(embeddings)
await vectorStore.addDocuments(splitDocs)
const retriever = vectorStore.asRetriever(2)

const res = await retriever.invoke('茴香豆是做什么用的')
console.log(res)

// const res2 = await retriever.invoke("下酒菜一般是什么？")

// console.log(res2)

// const res3 = await retriever.invoke("孔乙己用什么谋生？")
// console.log(res3)
