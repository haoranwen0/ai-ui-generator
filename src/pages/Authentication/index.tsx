import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import {
  AuthError,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from 'firebase/auth'

type AuthMode = 'signin' | 'signup' | 'forgot'

interface AuthFormProps {
  mode: AuthMode
  onSubmit: (data: { email: string; password?: string }) => void
  onForgotPassword: () => void
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  onForgotPassword
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password: mode !== 'forgot' ? password : undefined })
  }

  if (mode === 'forgot') {
    return (
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
            />
          </FormControl>
          <Button type='submit' colorScheme='purple' width='full'>
            Reset Password
          </Button>
          <Link color='purple.500' onClick={onForgotPassword}>
            Back to Sign In
          </Link>
        </VStack>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
          />
        </FormControl>
        <Button type='submit' colorScheme='purple' width='full'>
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
        {mode === 'signin' && (
          <Link color='purple.500' onClick={onForgotPassword}>
            Forgot Password?
          </Link>
        )}
      </VStack>
    </form>
  )
}

const AuthPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const bgColor = useColorModeValue('purple.50', 'purple.900')
  const textColor = useColorModeValue('purple.800', 'purple.100')

  const toast = useToast()

  const handleSignIn = async (email: string, password: string) => {
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      userCredential.user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        console.log(idToken);
      }).catch(function(error) {
        console.error("Failed to get ID token");
      });
      console.log('User signed in:', userCredential.user)
      toast({
        title: 'Success',
        description: 'You have successfully signed in.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
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
      toast({
        title: 'Success',
        description: 'Your account has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
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

  const handleAuthError = (error: unknown, action: string) => {
    const firebaseError = error as AuthError
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

  const handleSubmit = (data: { email: string; password?: string }) => {
    console.log('Form submitted:', data)

    switch (authMode) {
      case 'signin':
        if (data.password) handleSignIn(data.email, data.password)
        break
      case 'signup':
        if (data.password) handleSignUp(data.email, data.password)
        break
      case 'forgot':
        handleForgotPassword(data.email)
        break
      default:
        console.warn('Invalid auth mode:', authMode)
        break
    }
  }

  const onForgotPassword = () => {
    setAuthMode(authMode === 'forgot' ? 'signin' : 'forgot')
  }

  return (
    <Box
      minHeight='100vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      bg={bgColor}
    >
      <Box
        width='full'
        maxWidth='400px'
        p={8}
        borderRadius='lg'
        boxShadow='lg'
        bg={useColorModeValue('white', 'gray.700')}
      >
        <VStack spacing={6} align='stretch'>
          <Heading as='h1' size='xl' textAlign='center' color={textColor}>
            PurpleAuth
          </Heading>
          <Text fontSize='md' textAlign='center' color={textColor}>
            Your Secure Authentication Solution
          </Text>
          {authMode !== 'forgot' ? (
            <Tabs
              isFitted
              index={tabIndex}
              onChange={(index) => {
                setTabIndex(index)
                setAuthMode(index === 0 ? 'signin' : 'signup')
              }}
              colorScheme='purple'
            >
              <TabList mb='1em'>
                <Tab>Sign In</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <AuthForm
                    mode='signin'
                    onSubmit={handleSubmit}
                    onForgotPassword={onForgotPassword}
                  />
                </TabPanel>
                <TabPanel>
                  <AuthForm
                    mode='signup'
                    onSubmit={handleSubmit}
                    onForgotPassword={onForgotPassword}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <AuthForm
              mode='forgot'
              onSubmit={handleSubmit}
              onForgotPassword={onForgotPassword}
            />
          )}
          <Text fontSize='sm' textAlign='center' color={textColor}>
            By using this service, you agree to our{' '}
            <Link color='purple.500' href='#'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link color='purple.500' href='#'>
              Privacy Policy
            </Link>
            .
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}

export default AuthPage
