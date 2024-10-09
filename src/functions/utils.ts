import axios from 'axios'

import { Message } from '../components/Main/Chat'
import { post } from '../utils/api'

export const callAIUIGenerator = async (
  messages: Message[],
  userIdToken: string,
  designId: string
) => {
  const response = await post<{
    code?: string
    explanation?: string
    question?: Array<{
      id: number
      text: string
      type: 'multiple_choice' | 'text' | 'multi_select'
      options?: Array<string>
    }>
  }>(
    `/chat/${designId}`,
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
