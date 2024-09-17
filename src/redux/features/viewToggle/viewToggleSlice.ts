import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../../store'

export type View = 'Code' | 'Preview'

// Define a type for the slice state
interface ViewToggleState {
  view: View
}

// Define the initial state using that type
const initialState: ViewToggleState = {
  view: 'Code'
}

export const viewToggleSlice = createSlice({
  name: 'viewToggle',
  initialState,
  reducers: {
    toggle: (state) => {
      state.view = state.view === 'Code' ? 'Preview' : 'Code'
    },
    setView: (state, action: PayloadAction<View>) => {
      state.view = action.payload
    }
  }
})

export const { toggle, setView } = viewToggleSlice.actions

// Selector to get the current view
export const selectView = (state: RootState) => state.viewToggle.view

export default viewToggleSlice.reducer
