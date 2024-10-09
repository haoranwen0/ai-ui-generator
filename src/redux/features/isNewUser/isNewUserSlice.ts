import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../../store'

// Define a type for the slice state
interface IsNewUserState {
  value: boolean
}

// Define the initial state using that type
const initialState: IsNewUserState = {
  value: false
}

export const isNewUserSlice = createSlice({
  name: 'isNewUser',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    }
  }
})

export const { setIsNewUser } = isNewUserSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsNewUser = (state: RootState) => state.isNewUser.value

export default isNewUserSlice.reducer
