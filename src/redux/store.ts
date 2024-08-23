import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

import counterReducer from './features/counter/counterSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter'] // Only 'counter' will be persisted
}

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer
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
