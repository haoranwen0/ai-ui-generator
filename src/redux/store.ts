import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import counterReducer from './features/counter/counterSlice'
import viewToggleReducer from './features/viewToggle/viewToggleSlice'
import userReducer from './features/user/userSlice'
import chatReducer from './features/chat/chatSlice'
import codeEditorReducer from './features/codeEditor/codeEditorSlice'
import isNewUserReducer from './features/isNewUser/isNewUserSlice'
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['isNewUser'] // Only 'isNewUser' will be persisted
}

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  viewToggle: viewToggleReducer,
  isNewUser: isNewUserReducer,
  user: userReducer,
  chat: chatReducer,
  codeEditor: codeEditorReducer
})

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'PROD',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
