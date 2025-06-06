import React from 'react'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebaseConfig from './firebaseConfig'

import App from './App'
import { persistor, store } from './redux/store'

import './index.css'
import { connectAuthEmulator, getAuth } from 'firebase/auth'

import theme from './theme'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </PersistGate>
  </Provider>
)

export { auth }
