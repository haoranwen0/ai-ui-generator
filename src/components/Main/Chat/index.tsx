import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Flex,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Heading,
  Fade,
  Spinner,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast
} from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import QuestionsContainer, { Question } from '../Questions'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import {
  setMessages,
  addMessage,
  selectIsLoading,
  setIsLoading
} from '../../../redux/features/chat/chatSlice'
import { callAIUIGenerator } from '../../../functions/utils'
import { setCode } from '../../../redux/features/codeEditor/codeEditorSlice'
import { FiAlertCircle, FiMail } from 'react-icons/fi'
import {
  signOut,
  onAuthStateChanged,
  getAuth,
  User,
  getIdToken
} from 'firebase/auth'
import {
  setCount,
  decrement,
  selectCount
} from '../../../redux/features/counter/counterSlice'
import { useParams } from 'react-router-dom'
import { get } from '../../../utils/api'

export interface Message {
  content: string
  role: 'user' | 'assistant'
}

interface AssistantResponse {
  code?: string
  explanation?: string
  questions?: Question[]
}

const AssistantResponse: React.FC<{ content: string }> = ({ content }) => {
  const assistantData: AssistantResponse = JSON.parse(content)

  if (assistantData.questions) {
    return <QuestionsContainer questions={assistantData.questions} />
  }

  return <Text fontSize='md'>{assistantData.explanation}</Text>
}

const FadeInChatComponent: React.FC = () => {
  const messages = useAppSelector((store) => store.chat.value)
  const dispatch = useAppDispatch()
  const { designID } = useParams()
  const toast = useToast()
  const auth = getAuth()

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('purple.800', 'purple.100')
  const inputBgColor = useColorModeValue('purple.100', 'purple.700')
  const botMessageBg = useColorModeValue('gray.100', 'gray.800')
  const userMessageBg = useColorModeValue('purple.300', 'purple.500')
  const buttonColor = useColorModeValue('purple.400', 'purple.300')

  const counter = useAppSelector(selectCount)
  const [user, setUser] = useState<User | null>(null)
  const isLoading = useAppSelector(selectIsLoading)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isHistoryOpen])

  useEffect(() => {
    if (auth.currentUser) {
      // console.log('Fetching chat history 2')
      fetchChatHistory(auth.currentUser)
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // console.log('Fetching chat history')
        fetchChatHistory(currentUser)
      } else {
        setIsLoading(false)
        // setError('Please sign in to view your projects.')
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchChatHistory = async (currentUser: User) => {
    try {
      const idToken = await currentUser.getIdToken()

      // console.log(designID, idToken)

      const response = await get<Message[]>(`/history/${designID}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })

      // console.log('Chat history:', response.data)

      dispatch(setMessages(response.data))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error fetching chat history',
        status: 'error',
        duration: 5000,
        isClosable: true
      })

      // console.log('Error fetching chat history', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // console.log(counter)

    if (user === null) {
      return
    }

    if (counter <= 0) {
      // Display an alert or message that the user is out of credits
      // console.log('Out of credits')
      return
    }

    if (inputValue.trim()) {
      const newMessage: Message = {
        content: inputValue,
        role: 'user'
      }
      dispatch(addMessage(newMessage))
      setInputValue('')

      dispatch(setIsLoading(true))

      try {
        const data = await callAIUIGenerator(
          [...messages, newMessage],
          await user.getIdToken(),
          designID as string
        )

        console.log('Data: ', data)

        dispatch(
          addMessage({ content: JSON.stringify(data), role: 'assistant' })
        )

        if (data.code) {
          dispatch(setCode(data.code))
        }
        dispatch(decrement())
        // console.log(counter)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error submitting message',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
        // console.log('Error submitting message', error)
      } finally {
        dispatch(setIsLoading(false))
      }
    }
  }

  return (
    <Box
      position='fixed'
      bottom={0}
      left='50%'
      transform='translateX(-50%)'
      width='50%'
      maxWidth='600px'
      zIndex={1000}
    >
      <Box
        bg={isHistoryOpen ? bgColor : 'transparent'}
        // boxShadow='xl'
        borderRadius='md'
        overflow='hidden'
        display='flex'
        flexDirection='column'
        mb={2}
        onMouseEnter={() => counter > 0 && setIsHistoryOpen(true)}
        onMouseLeave={() => counter > 0 && setIsHistoryOpen(false)}
      >
        <Fade in={isHistoryOpen} unmountOnExit>
          <Flex
            p={4}
            borderBottomWidth={1}
            alignItems='center'
            borderBottomColor={useColorModeValue('purple.100', 'purple.800')}
          >
            <Heading size='md' color={textColor}>
              Augment UI
            </Heading>
          </Flex>
          <VStack
            height='60vh'
            overflowY='auto'
            spacing={4}
            p={4}
            alignItems='stretch'
          >
            {messages.length === 0 && (
              <VStack spacing={4} align='stretch' width='100%'>
                <Text fontSize='lg' fontWeight='bold' color={textColor}>
                  Try these example prompts:
                </Text>
                <Button
                  onClick={() =>
                    setInputValue(
                      'Design a modern login page with a gradient background'
                    )
                  }
                  colorScheme='purple'
                  variant='outline'
                  justifyContent='flex-start'
                  height='auto'
                  whiteSpace='normal'
                  textAlign='left'
                  py={2}
                >
                  Design a modern login page with a gradient background
                </Button>
                <Button
                  onClick={() =>
                    setInputValue(
                      'Create a responsive navigation bar with a logo and dropdown menu'
                    )
                  }
                  colorScheme='purple'
                  variant='outline'
                  justifyContent='flex-start'
                  height='auto'
                  whiteSpace='normal'
                  textAlign='left'
                  py={2}
                >
                  Create a responsive navigation bar with a logo and dropdown
                  menu
                </Button>
                <Button
                  onClick={() =>
                    setInputValue(
                      'Generate a card component for displaying product information'
                    )
                  }
                  colorScheme='purple'
                  variant='outline'
                  justifyContent='flex-start'
                  height='auto'
                  whiteSpace='normal'
                  textAlign='left'
                  py={2}
                >
                  Generate a card component for displaying product information
                </Button>
              </VStack>
            )}
            {messages.map((message, index) => (
              <Flex
                flexDir='column'
                key={index}
                alignItems={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  bg={message.role === 'user' ? userMessageBg : botMessageBg}
                  color={textColor}
                  borderRadius='md'
                  maxWidth='70%'
                >
                  {message.role === 'user' ? (
                    <Text fontSize='md' px={4} py={2}>
                      {message.content}
                    </Text>
                  ) : (
                    <Box p={4}>
                      <AssistantResponse content={message.content} />
                    </Box>
                  )}
                </Box>
              </Flex>
            ))}
            {isLoading && (
              <Flex
                justifyContent='center'
                alignItems='center'
                width='100%'
                flexDirection='column'
                flexWrap='wrap'
              >
                <Spinner
                  thickness='2px'
                  speed='0.65s'
                  emptyColor={useColorModeValue('purple.100', 'purple.700')}
                  color={buttonColor}
                  size='sm'
                  mb={2}
                />
                <Text fontSize='sm' color={textColor} textAlign='center'>
                  {
                    [
                      'Did you know? The first graphical user interface was developed at Xerox PARC in the 1970s.',
                      'Fun fact: The average user forms an opinion about a website in just 0.05 seconds!',
                      'UX trivia: "Responsive design" was coined by Ethan Marcotte in 2010.',
                      'Interesting: The term "User Experience" was coined by Don Norman in the 1990s while at Apple.',
                      'Color fact: Blue is the most common color used in UI design for its calming effect.',
                      'Typography tidbit: Sans-serif fonts are generally easier to read on digital screens.',
                      'Usability note: The "three-click rule" suggests users should find info within three mouse clicks.',
                      'Design history: Skeuomorphism was a major UI trend in early smartphone interfaces.',
                      'Accessibility fact: About 1 in 12 men have some form of color blindness.',
                      "UX principle: Hick's Law states that the time it takes to make a decision increases with the number of options."
                    ][Math.floor(Math.random() * 10)]
                  }
                </Text>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Fade>
        <Box p={4} bg='transparent'>
          {/* {counter > 0 ? ( */}
          {counter > 0 ? (
            <form onSubmit={handleSubmit}>
              <Flex position='relative'>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='Type a message...'
                  bg={`${inputBgColor}CC`} // Added 'CC' for 80% opacity
                  pr={10}
                  borderRadius='md'
                  opacity={0.45}
                  flex={1}
                  _placeholder={{
                    color: useColorModeValue('purple.400', 'purple.300')
                  }}
                  transition='opacity 0.2s ease-in-out'
                  _hover={{
                    opacity: 1
                  }}
                  _focus={{
                    opacity: 1,
                    borderColor: 'purple.400',
                    boxShadow: '0 0 0 2px purple.500'
                  }}
                />

                <Flex
                  position='absolute'
                  right={4}
                  top='50%'
                  transform='translateY(-50%)'
                  zIndex={2}
                  alignItems='center'
                  opacity={0.8}
                  transition='opacity 0.2s ease-in-out'
                  _hover={{ opacity: 1 }}
                  cursor='pointer'
                  onClick={handleSubmit}
                >
                  <Icon as={FaPaperPlane} color={buttonColor} />
                </Flex>
              </Flex>
            </form>
          ) : (
            <Box
              borderWidth={1}
              borderColor={useColorModeValue('purple.200', 'purple.700')}
              borderRadius='md'
              p={4}
              bg={useColorModeValue('purple.50', 'purple.900')}
              color={useColorModeValue('purple.800', 'purple.200')}
            >
              <Flex alignItems='center' justifyContent='space-between'>
                <Text fontWeight='bold'>Out of credits</Text>
                <Icon
                  as={FiAlertCircle}
                  color={useColorModeValue('purple.500', 'purple.300')}
                />
              </Flex>
              <Text mt={2} fontSize='sm'>
                You&apos;ve used all your available credits. Sign up for our
                mailing list to stay tuned for the next phase of our project.
              </Text>
              <Button
                mt={3}
                size='sm'
                colorScheme='purple'
                variant='outline'
                leftIcon={<FiMail />}
                onClick={() =>
                  window.open(
                    'https://qualtricsxmpsybmcsgf.qualtrics.com/jfe/form/SV_37xNYk8iToBrS5M',
                    '_blank'
                  )
                }
              >
                Join Mailing List
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default FadeInChatComponent
