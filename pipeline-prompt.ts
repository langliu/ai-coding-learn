import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个中文 AI 助手，请结合上下文连续回答。'],
  new MessagesPlaceholder('history'),
  ['human', '{question}'],
])

const messages = await prompt.invoke({
  history: [
    new HumanMessage('什么是 LangChain？'),
    new AIMessage('LangChain 是一个用于构建 LLM 应用的开发框架。'),
  ],
  question: '那 PromptTemplate 是做什么的？',
})

console.log(messages)
