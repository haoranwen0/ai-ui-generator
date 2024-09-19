import React from 'react'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import useAuth from './hooks/useAuth'
import { Authentication, Landing, Main, NotFound } from './pages'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='*' element={<NotFound />} />
      <Route index element={<Landing />} />
      <Route path='auth' element={<Authentication />} />
      {/* Change the path name to whatever is fitting. For example, /chat */}
      <Route path='main-app-page' element={<Main />} />
    </Route>
  )
)

const App: React.FC = () => {
  useAuth()

  return <RouterProvider router={router} />
}

export default App
