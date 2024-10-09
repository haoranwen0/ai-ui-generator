import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useAppDispatch } from '../redux/hooks'
import { signIn, signOut } from '../redux/features/user/userSlice'
import { auth } from '../index'

export default function useAuth() {
  const [finished, setFinished] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        // console.log('User is signed in', user)
        dispatch(signIn(user))
      } else {
        // User is signed out
        // console.log('User is signed out')
        dispatch(signOut())
      }
      setFinished(true)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [dispatch])

  return finished
}
