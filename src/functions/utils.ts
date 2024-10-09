import axios from 'axios'

import { Message } from '../components/Main/Chat'
import { Params } from 'react-router-dom'

export const callAIUIGenerator = async (
  messages: Message[],
  userIdToken: string,
  designId: string
) => {
  const response = await axios.post(
    `http://127.0.0.1:5001/ai-ui-generator/us-central1/main/chat/${designId}`,
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
