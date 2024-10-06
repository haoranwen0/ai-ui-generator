import axios from 'axios'

import { Message } from '../components/Main/Chat'

export const callAIUIGenerator = async (
  messages: Message[],
  userIdToken: string
) => {
  const response = await axios.post(
    'http://127.0.0.1:5001/ai-ui-generator/us-central1/main/chat',
    {
      chat_history: messages
    },
    {
      headers: {
        Authorization: `Bearer ${userIdToken}`
      }
    }
  )

  return response.data
}
