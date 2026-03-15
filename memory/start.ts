import { InMemoryChatMessageHistory } from '@langchain/core/chat_history'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'

import { model } from '../utils/model'

const history = new InMemoryChatMessageHistory()

await history.addMessage(new HumanMessage('hi'))
await history.addMessage(new AIMessage('What can I do for you?'))

const messages = await history.getMessages()

console.log(messages)

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a helpful assistant. 始终使用中文回答。Answer all questions to the best of your ability.
    You are talkative and provides lots of specific details from its context.
    If the you does not know the answer to a question, it truthfully says you do not know.`,
  ],
  new MessagesPlaceholder('history_message'),
])

const chain = prompt.pipe(model)

const res1 = await chain.invoke({
  history_message: await history.getMessages(),
})
await history.addMessage(res1)
await history.addMessage(new HumanMessage('What is my name?'))
const res2 = await chain.invoke({
  history_message: await history.getMessages(),
})

console.log(res2)
