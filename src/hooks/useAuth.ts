import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useAppDispatch } from '../redux/hooks'
import { signIn, signOut } from '../redux/features/user/userSlice'
export default function useAuth() {
  const auth = getAuth()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log('User is signed in', user)
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
