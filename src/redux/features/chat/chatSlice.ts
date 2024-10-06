import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../../store'
import { Message } from '../../../components/Main/Chat'

// Define a type for the slice state
interface ChatState {
  value: Message[]
}

// Define the initial state using that type
const initialState: ChatState = {
  value: []
}

export const chatSlice = createSlice({
  name: 'chat',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.value.push(action.payload)
    }
  }
})

export const { addMessage } = chatSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectChat = (state: RootState) => state.chat.value

export default chatSlice.reducer
