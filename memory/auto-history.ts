import { InMemoryChatMessageHistory } from '@langchain/core/chat_history'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { RunnableWithMessageHistory } from '@langchain/core/runnables'

import { model } from '../utils/model'

const history = new InMemoryChatMessageHistory()

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a helpful assistant. 始终使用中文回答。Answer all questions to the best of your ability.
    You are talkative and provides lots of specific details from its context.
    If the you does not know the answer to a question, it truthfully says you do not know.`,
  ],
  new MessagesPlaceholder('history_message'),
  ['human', '{input}'],
])

const chain = prompt.pipe(model)

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (_sessionId) => history,
  inputMessagesKey: 'input',
  historyMessagesKey: 'history_message',
})

const res1 = await chainWithHistory.invoke(
  {
    input: '你好，我是张三',
  },
  {
    configurable: { sessionId: 'none' },
  },
)

console.log(res1)

const res2 = await chainWithHistory.invoke(
  {
    input: '我叫什么名字？',
  },
  {
    configurable: { sessionId: 'none' },
  },
)

console.log(res2)
