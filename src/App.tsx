import React, { useEffect } from 'react'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import useAuth from './hooks/useAuth'
import {
  Authentication,
  Dashboard,
  Landing,
  Main,
  NotFound,
  NotAuthenticated
} from './pages'
import { useColorMode } from '@chakra-ui/react'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='*' element={<NotFound />} />
      <Route path='not-authenticated' element={<NotAuthenticated />} />
      <Route index element={<Landing />} />
      <Route path='auth' element={<Authentication />} />
      <Route path='dashboard' element={<Dashboard />} />
      {/* Change the path name to whatever is fitting. For example, /chat */}
      <Route path='design'>
        <Route path=':designID' element={<Main />} />
      </Route>
    </Route>
  )
)

const App: React.FC = () => {
  const { setColorMode } = useColorMode()

  useAuth()

  useEffect(() => {
    setColorMode('dark')
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
