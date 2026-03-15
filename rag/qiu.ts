import { TextLoader } from '@langchain/classic/document_loaders/fs/text'
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

import { model, embeddings } from '../utils/model'

const TEMPLATE = `
你是一个熟读刘慈欣的《球状闪电》的终极原著党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答“原文中没有相关内容”，

以下是原文中跟用户回答相关的内容：
{context}

现在，你需要基于原文，回答以下问题：
{question}`

const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE)

// 加载txt文件
const loader = new TextLoader('data/qiu.txt')
const docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
})

const splitterDocs = await splitter.splitDocuments(docs)
console.log(splitterDocs[4])

const vectorStore = new MemoryVectorStore(embeddings)
await vectorStore.addDocuments(splitterDocs)

const retriever = vectorStore.asRetriever(2)

function convertDocsToString(documents: Document[]): string {
  return documents.map((document) => document.pageContent).join('\n')
}

function getQuestion(input: string | { question: string }): string {
  return typeof input === 'string' ? input : input.question
}

// RunnableSequence.from 会把多个可运行步骤按顺序串起来，形成一条可 invoke 的链。
// 这里这条链的流程是：提取问题 -> 用 retriever 检索相关片段 -> 把检索结果拼成上下文字符串。
const contextRetrieverChain = RunnableSequence.from([getQuestion, retriever, convertDocsToString])

const res = await contextRetrieverChain.invoke(
  '原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论',
)

// 这条链是在检索链外面再包一层完整的 RAG 流程：
// 先生成 prompt 入参，再交给模型回答，最后把模型输出转成字符串。
const ragChain = RunnableSequence.from([
  {
    context: contextRetrieverChain,
    question: (input: { question: string }) => input.question,
  },
  prompt,
  model,
  new StringOutputParser(),
])
// const answer = await ragChain.invoke({
//   question: '什么是球形闪电',
// })
// console.log(res)
// console.log(answer)

const answer = await ragChain.invoke({
  question: '详细描述原文中有什么跟直升机相关的场景',
})

console.log(answer)
