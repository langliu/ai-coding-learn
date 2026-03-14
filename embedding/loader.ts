import { TextLoader } from '@langchain/classic/document_loaders/fs/text'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
})

const loader = new TextLoader('data/kong.txt')

const docs = await loader.load()
const splitDocs = await splitter.splitDocuments(docs)

console.log(splitDocs)
