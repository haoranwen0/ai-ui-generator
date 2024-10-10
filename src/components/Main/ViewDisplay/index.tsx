import React, { useState, useEffect, useCallback } from 'react'
import {
  Flex,
  IconButton,
  Tooltip,
  Box,
  useToast,
  Spinner,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  useDisclosure,
  OrderedList,
  ListItem,
  Link
} from '@chakra-ui/react'
import { FiCheckCircle, FiHome, FiZap } from 'react-icons/fi'
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  SandpackLayout
} from '@codesandbox/sandpack-react'
import { useNavigate, useParams } from 'react-router-dom'
import { auth } from '../../..'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import {
  selectCode,
  setCode
} from '../../../redux/features/codeEditor/codeEditorSlice'
import {
  selectIsNewUser,
  setIsNewUser
} from '../../../redux/features/isNewUser/isNewUserSlice'
import { get, patch } from '../../../utils/api'

const ViewDisplay = () => {
  const dispatch = useAppDispatch()
  const { designID } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const isNewUser = useAppSelector(selectIsNewUser)
  const code = useAppSelector(selectCode)

  const { isOpen, onOpen, onClose } = useDisclosure()

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

  useEffect(() => {
    if (isNewUser) {
      onOpen()
    }
  }, [isNewUser, onOpen])

  const fetchCode = async (idToken: string) => {
    try {
      const response = await get<{ code: string }>(`/project/${designID}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
      dispatch(setCode(response.data.code))
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
    }, 5000) // Save every 30 seconds

    return () => clearInterval(saveInterval)
  }, [user, designID, code])

  const saveContent = useCallback(async () => {
    if (user === null) {
      return
    }

    try {
      const idToken = await user.getIdToken()

      await patch<{ code: string }>(
        `/project/${designID}`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error saving code',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      // console.error('Error saving code:', error)
    }
  }, [user, designID, code])

  const handleBackToDashboard = () => {
    navigate('/dashboard') // Adjust this path if your dashboard route is different
  }

  return (
    <Flex direction='column' h='100vh' w='100%'>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          dispatch(setIsNewUser(false))
        }}
        size='lg'
        isCentered
      >
        <ModalOverlay backdropFilter='blur(8px)' />
        <ModalContent
          borderRadius='xl'
          boxShadow='xl'
          bg='gray.900'
          color='white'
        >
          <ModalHeader
            textAlign='left'
            fontSize='2xl'
            fontWeight='bold'
            borderBottom='1px'
            borderColor='gray.700'
            py={4}
          >
            Welcome to{' '}
            <Text
              as='span'
              bgGradient='linear(to-r, purple.400, pink.400)'
              bgClip='text'
            >
              Augment UI
            </Text>
            !
          </ModalHeader>
          <ModalCloseButton color='gray.400' />
          <ModalBody py={6}>
            <VStack spacing={6} align='stretch'>
              <Text textAlign='left' fontSize='lg' fontWeight='medium'>
                Here are some quick tips to get you started:
              </Text>
              <OrderedList spacing={4} stylePosition='outside'>
                <ListItem>
                  This is a beta version, so it might be a bit... quirky. If you
                  spot any gremlins in the system, give us a shout at{' '}
                  <Link
                    href='mailto:team@augment-ui.com'
                    color='purple.400'
                    textDecoration='underline'
                  >
                    team@augment-ui.com
                  </Link>
                  . We promise we don&apos;t bite!
                </ListItem>
                <ListItem>
                  You&apos;ve got 15 magical credits to play with. Each time you
                  chat, you use one credit. Use them wisely, or don&apos;t -
                  we&apos;re not your mom!
                </ListItem>
                <ListItem>
                  Right now, Augment is a Chakra UI enthusiast. We&apos;re
                  working on expanding its component palette, so stay tuned for
                  more UI flavors!
                </ListItem>
                <ListItem>
                  Psst! See that chat bubble at the bottom center? That&apos;s
                  your direct line to the Augment UI. Tell it your wildest UI
                  dreams, and watch the magic happen!
                </ListItem>
              </OrderedList>
            </VStack>
          </ModalBody>
          <ModalFooter
            justifyContent='center'
            borderTop='1px'
            borderColor='gray.700'
            py={4}
          >
            <Button
              colorScheme='purple'
              onClick={() => {
                onClose()
                dispatch(setIsNewUser(false))
              }}
              size='lg'
              fontWeight='bold'
              borderRadius='full'
              px={8}
              leftIcon={<FiZap />}
            >
              Let&apos;s Create!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
            Augment UI
          </Text>
          {/* <Image
            src={Logo}
            alt='Augment Logo'
            boxSize={6}
            mr={3}
            filter='brightness(0) saturate(100%) invert(80%) sepia(100%) saturate(500%) hue-rotate(280deg) brightness(100%) contrast(100%)'
          /> */}
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
                'react-draggable': 'latest',
                'react-beautiful-dnd': 'latest',
                'react-spring': 'latest',
                'react-transition-group': 'latest',
                'react-motion': 'latest',
                'react-dnd': 'latest',
                'react-dnd-html5-backend': 'latest',
                'react-slick': 'latest',
                'slick-carousel': 'latest',
                'react-animate-on-scroll': 'latest',
                'react-flip-move': 'latest',
                'react-reveal': 'latest',
                'react-awesome-reveal': 'latest',
                gsap: 'latest',
                aos: 'latest'
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
