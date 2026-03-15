import { MemorySaver } from '@langchain/langgraph'
import { createAgent, tool, toolStrategy, type ToolRuntime } from 'langchain'
import * as z from 'zod'

import { model } from '../utils/model'

const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
  name: 'get_weather',
  description: 'Get the weather for a given city',
  schema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
})

type AgentRuntime = ToolRuntime<unknown, { user_id: string }>

const getUserLocation = tool(
  (_, config: AgentRuntime) => {
    const { user_id } = config.context
    return user_id === '1' ? 'Florida' : 'SF'
  },
  {
    name: 'get_user_location',
    description: 'Retrieve user information based on user ID',
    schema: z.object({}),
  },
)

const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean wherever they are, use the get_user_location tool to find their location.`

const responseFormat = z.object({
  punny_response: z.string(),
  weather_conditions: z.string().optional(),
})

const checkpointer = new MemorySaver()

const agent = createAgent({
  model,
  tools: [getWeather, getUserLocation],
  // OpenRouter is OpenAI-compatible, but provider-native structured output can still
  // fail depending on the routed upstream provider. Tool strategy is more portable.
  responseFormat: toolStrategy(responseFormat),
  checkpointer,
  systemPrompt,
})

const config = {
  configurable: { thread_id: '1' },
  context: { user_id: '1' },
}

console.log(
  await agent.invoke(
    {
      messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
    },
    config,
  ),
)
