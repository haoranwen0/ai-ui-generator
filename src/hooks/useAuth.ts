import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useAppDispatch } from '../redux/hooks'
import { signIn, signOut } from '../redux/features/user/userSlice'
import { auth } from '../index'

export default function useAuth() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        console.log('User is signed in', user)
        console.log(await user.getIdToken())
        dispatch(signIn(user))
      } else {
        // User is signed out
        console.log('User is signed out')
        dispatch(signOut())
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [dispatch])
}
