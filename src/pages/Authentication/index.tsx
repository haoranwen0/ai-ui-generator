import React, { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Link,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  AuthError,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth'

// Types
type AuthMode = 'signin' | 'signup' | 'forgot'

interface AuthFormProps {
  mode: AuthMode
  onSubmit: (data: { email: string; password: string }) => void
  onModeChange: (mode: AuthMode) => void
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  onModeChange
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align='stretch'>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        {mode !== 'forgot' && (
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
        )}
        <Button type='submit' colorScheme='purple' size='lg'>
          {mode === 'signin'
            ? 'Sign In'
            : mode === 'signup'
            ? 'Sign Up'
            : 'Reset Password'}
        </Button>
      </VStack>
      <Flex mt={4} justifyContent='space-between'>
        {mode !== 'signin' && (
          <Link onClick={() => onModeChange('signin')}>Sign In</Link>
        )}
        {mode !== 'signup' && (
          <Link onClick={() => onModeChange('signup')}>Sign Up</Link>
        )}
        {mode !== 'forgot' && (
          <Link onClick={() => onModeChange('forgot')}>Forgot Password</Link>
        )}
      </Flex>
    </form>
  )
}

const CenteredAuthPage: React.FC = () => {
  const toast = useToast()

  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.100')

  // Authentication Service Functions
  const handleSignIn = async (email: string, password: string) => {
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log('User signed in:', userCredential.user)
    } catch (error) {
      handleAuthError(error, 'signing in')
    }
  }

  const handleSignUp = async (email: string, password: string) => {
    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log('User signed up:', userCredential.user)
    } catch (error) {
      handleAuthError(error, 'signing up')
    }
  }

  const handleForgotPassword = async (email: string) => {
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast({
        title: 'Success',
        description: 'Password reset email sent. Please check your inbox.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      handleAuthError(error, 'sending password reset email')
    }
  }

  // Error handling function
  const handleAuthError = (error: unknown, action: string) => {
    const firebaseError = error as AuthError // Typecasting the error as Firebase AuthError
    console.error(`Error ${action}:`, firebaseError)

    const errorMessage = firebaseError.message || 'An unknown error occurred'

    toast({
      title: 'Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true
    })
  }

  // Main Form Submit Handler
  const handleSubmit = (data: { email: string; password: string }) => {
    console.log('Form submitted:', data)

    switch (authMode) {
      case 'signin':
        handleSignIn(data.email, data.password)
        break
      case 'signup':
        handleSignUp(data.email, data.password)
        break
      case 'forgot':
        handleForgotPassword(data.email)
        break
      default:
        console.warn('Invalid auth mode:', authMode)
        break
    }
  }

  return (
    <Flex
      minHeight='100vh'
      width='full'
      align='center'
      justifyContent='center'
      bg={bgColor}
    >
      <Box
        borderWidth={1}
        px={8}
        py={8}
        width='full'
        maxWidth='400px'
        borderRadius={4}
        textAlign='center'
        boxShadow='lg'
        bg={cardBgColor}
      >
        <VStack spacing={8} align='stretch'>
          <Heading as='h1' size='xl' color='purple.400'>
            {/* Placeholder for company name */}
            [Your Company]
          </Heading>
          {/* <Button
            onClick={() => {
              const auth = getAuth()
              signOut(auth)
                .then(() => {
                  console.log('User signed out')
                  toast({
                    title: 'Signed out',
                    description: 'You have been successfully signed out.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                  })
                })
                .catch((error) => {
                  console.error('Sign out error', error)
                  toast({
                    title: 'Sign out failed',
                    description: 'An error occurred while signing out.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                  })
                })
            }}
          >
            Sign Out
          </Button> */}
          <Text fontSize='xl' color={textColor}>
            {authMode === 'signin'
              ? 'Sign in to your account'
              : authMode === 'signup'
              ? 'Create a new account'
              : 'Reset your password'}
          </Text>
          <AuthForm
            mode={authMode}
            onSubmit={handleSubmit}
            onModeChange={setAuthMode}
          />
        </VStack>
      </Box>
    </Flex>
  )
}

export default CenteredAuthPage
