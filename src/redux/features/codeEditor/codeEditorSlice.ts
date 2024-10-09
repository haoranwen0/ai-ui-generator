import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../../store'

// Define a type for the slice state
interface CodeEditorState {
  value: string
}

// Define the initial state using that type
const initialState: CodeEditorState = {
  value: ''
}

export const codeEditorSlice = createSlice({
  name: 'codeEditor',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      console.log('action', action)
      state.value = action.payload
    }
  }
})

export const { setCode } = codeEditorSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCode = (state: RootState) => state.codeEditor.value

export default codeEditorSlice.reducer
