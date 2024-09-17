import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import counterReducer from './features/counter/counterSlice'
import viewToggleReducer from './features/viewToggle/viewToggleSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter', 'viewToggle'] // Only 'counter' will be persisted
}

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  viewToggle: viewToggleReducer
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
