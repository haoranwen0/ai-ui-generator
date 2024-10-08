import React, { useState, useEffect, useCallback } from 'react'
import {
  Flex,
  IconButton,
  Tooltip,
  Box,
  Text,
  useToast,
  Spinner,
  Image
} from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  SandpackLayout
} from '@codesandbox/sandpack-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { auth } from '../../..'
import { onAuthStateChanged, User } from 'firebase/auth'
import Logo from '../../../assets/images/logo.svg'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import {
  selectCode,
  setCode
} from '../../../redux/features/codeEditor/codeEditorSlice'

const ViewDisplay = () => {
  const dispatch = useAppDispatch()
  const { designID } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const code = useAppSelector(selectCode)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setIsLoading(true)
        await fetchCode(await currentUser.getIdToken())
        setIsLoading(false)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const fetchCode = async (idToken: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/ai-ui-generator/us-central1/main/project/${designID}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
      dispatch(setCode(response.data['code']))
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveContent()
    }, 3000) // Save every 30 seconds

    return () => clearInterval(saveInterval)
  }, [user, designID, code])

  const saveContent = useCallback(async () => {
    if (user === null) {
      return
    }

    try {
      const idToken = await user.getIdToken()

      await axios.patch(
        `http://127.0.0.1:5001/ai-ui-generator/us-central1/main/project/${designID}`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
    } catch (error) {
      console.error('Error saving code:', error)
    }
  }, [user, designID, code])

  const handleBackToDashboard = () => {
    navigate('/dashboard') // Adjust this path if your dashboard route is different
  }

  return (
    <Flex direction='column' h='100vh' w='100%'>
      <Flex
        as='header'
        align='center'
        justify='space-between'
        wrap='wrap'
        padding='0.5rem'
        bg='gray.900'
        color='white'
        boxShadow='md'
      >
        <Flex align='center'>
          <Tooltip label='Back to Dashboard' placement='right'>
            <IconButton
              icon={<FiHome />}
              onClick={handleBackToDashboard}
              size='md'
              fontSize='20px'
              variant='ghost'
              color='purple.500'
              _hover={{ bg: 'purple.900' }}
              mr={3}
              aria-label='Back to Dashboard'
            />
          </Tooltip>
        </Flex>
        <Flex align='center' gap={2}>
          <Text fontWeight='bold' fontSize='lg'>
            Augment
          </Text>
          <Image
            src={Logo}
            alt='Augment Logo'
            boxSize={6}
            mr={3}
            filter='brightness(0) saturate(100%) invert(80%) sepia(100%) saturate(500%) hue-rotate(280deg) brightness(100%) contrast(100%)'
          />
        </Flex>
      </Flex>
      <Box flex='1'>
        {isLoading ? (
          <Flex justifyContent='center' alignItems='center' height='100%'>
            <Spinner size='lg' />
          </Flex>
        ) : (
          <SandpackProvider
            template='react'
            theme='auto'
            customSetup={{
              dependencies: {
                '@chakra-ui/react': 'latest',
                '@chakra-ui/icons': 'latest',
                '@emotion/react': 'latest',
                '@emotion/styled': 'latest',
                'framer-motion': 'latest',
                'react-icons': 'latest',
                recharts: 'latest',
                'react-draggable': 'latest'
              },
              entry: '/index.js'
            }}
            files={{
              '/App.js': code
            }}
            options={{
              classes: {
                'sp-wrapper': 'custom-wrapper',
                'sp-layout': 'custom-layout',
                'sp-tab-button': 'custom-tab',
                'sp-editor': 'custom-editor',
                'sp-preview': 'custom-preview',
                'sp-file-explorer': 'custom-file-explorer'
              }
            }}
          >
            <SandpackLayout>
              <CodeEditor />
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>
        )}
      </Box>
    </Flex>
  )
}

const CodeEditor: React.FC = () => {
  const dispatch = useAppDispatch()

  const { code } = useActiveCode()

  useEffect(() => {
    dispatch(setCode(code))
  }, [code])

  return (
    <SandpackCodeEditor showTabs showLineNumbers showInlineErrors wrapContent />
  )
}

export default ViewDisplay
