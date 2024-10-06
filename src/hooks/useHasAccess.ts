import { useEffect } from 'react'
import { auth } from '../index'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'

interface UseHasAccessParams {
  validAccessRedirectLink?: string
  invalidAccessRedirectLink?: string
}

export default function useHasAccess({
  validAccessRedirectLink,
  invalidAccessRedirectLink
}: UseHasAccessParams) {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log('User has access', user)
        if (validAccessRedirectLink) {
          navigate(validAccessRedirectLink)
        }
      } else {
        // User is signed out
        if (invalidAccessRedirectLink) {
          navigate(invalidAccessRedirectLink)
        }
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])
}
