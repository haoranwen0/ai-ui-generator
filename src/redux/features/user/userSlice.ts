import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

import type { RootState } from '../../store'

// Define a type for the slice state
interface UserState {
  user: User | null
}

// Define the initial state using that type
const initialState: UserState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    signOut: (state) => {
      state.user = null
    }
  }
})

export const { signIn, signOut } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer
