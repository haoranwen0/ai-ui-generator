import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../../store'
import { Message } from '../../../components/Main/Chat'

// Define a type for the slice state
interface ChatState {
  value: Message[]
  isLoading: boolean
}

// Define the initial state using that type
const initialState: ChatState = {
  value: [],
  isLoading: false
}

export const chatSlice = createSlice({
  name: 'chat',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.value.push(action.payload)
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const { addMessage, setIsLoading } = chatSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectChat = (state: RootState) => state.chat.value
export const selectIsLoading = (state: RootState) => state.chat.isLoading
export default chatSlice.reducer
