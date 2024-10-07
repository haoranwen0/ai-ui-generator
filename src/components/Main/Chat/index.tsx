import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Flex,
  Input,
  VStack,
  Text,
  useColorModeValue,
  IconButton,
  Heading,
  Fade,
  Spinner
} from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import QuestionsContainer, { Question } from '../Questions'
import axios from 'axios'
import { useAppSelector } from '../../../redux/hooks'
import {
  addMessage,
  selectIsLoading,
  setIsLoading
} from '../../../redux/features/chat/chatSlice'
import { useDispatch } from 'react-redux'
import { callAIUIGenerator } from '../../../functions/utils'
import { setCode } from '../../../redux/features/codeEditor/codeEditorSlice'

const questions: Question[] = [
  {
    id: 1,
    text: 'What color scheme would you prefer for the app?',
    type: 'multiple_choice',
    options: [
      'Light (white background)',
      'Dark (dark background)',
      'Blue-based',
      'Green-based'
    ]
  },
  {
    id: 2,
    text: 'How would you like to organize the main layout?',
    type: 'multiple_choice',
    options: [
      'Sidebar navigation',
      'Top navigation bar',
      'Card-based layout',
      'Tabbed interface'
    ]
  },
  {
    id: 3,
    text: 'Which feature should be most prominent on the main page?',
    type: 'multiple_choice',
    options: ['Problem list', 'User profile', 'Leaderboard', 'Discussion forum']
  },
  {
    id: 4,
    text: 'How would you like to display individual problems?',
    type: 'multiple_choice',
    options: ['Card view', 'List view', 'Grid view', 'Expandable sections']
  },
  {
    id: 5,
    text: 'What type of text editor would you prefer for solving problems?',
    type: 'multiple_choice',
    options: [
      'Simple textarea',
      'Syntax-highlighted editor',
      'Split-view (problem and code)',
      'Full-screen code editor'
    ]
  },
  {
    id: 6,
    text: 'How would you like to implement the discussion feature?',
    type: 'multiple_choice',
    options: [
      'Threaded comments',
      'Real-time chat',
      'Forum-style posts',
      'Q&A format'
    ]
  },
  {
    id: 7,
    text: 'Do you want to include any gamification elements?',
    type: 'multiple_choice',
    options: [
      'Points system',
      'Badges/Achievements',
      'Daily challenges',
      'None'
    ]
  },
  {
    id: 8,
    text: 'How important is mobile responsiveness for your app?',
    type: 'text'
  }
]

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

  console.log(content, assistantData)

  if (assistantData.questions) {
    return <QuestionsContainer questions={assistantData.questions} />
  }

  return <Text fontSize='md'>{assistantData.explanation}</Text>
}

const FadeInChatComponent: React.FC = () => {
  const messages = useAppSelector((store) => store.chat.value)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('purple.50', 'purple.900')
  const textColor = useColorModeValue('purple.800', 'purple.100')
  const inputBgColor = useColorModeValue('purple.100', 'purple.700')
  const botMessageBg = useColorModeValue('purple.100', 'purple.700')
  const userMessageBg = useColorModeValue('purple.300', 'purple.500')
  const buttonColor = useColorModeValue('purple.400', 'purple.300')

  const user = useAppSelector((state) => state.user.user)
  const isLoading = useAppSelector(selectIsLoading)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault()
        setIsOpen((prev) => !prev)
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 0)
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user === null) {
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
          await user.getIdToken()
        )

        dispatch(
          addMessage({ content: JSON.stringify(data), role: 'assistant' })
        )

        if (data.code) {
          dispatch(setCode(data.code))
        }
      } catch (error) {
        console.log('Error submitting message', error)
      } finally {
        dispatch(setIsLoading(false))
      }
    }
  }

  return (
    <Box
      position='fixed'
      bottom={4}
      left='50%'
      transform='translateX(-50%)'
      width='50%'
      maxWidth='600px'
      zIndex={1000}
    >
      <Fade in={isOpen} unmountOnExit>
        <Box
          bg={bgColor}
          boxShadow='xl'
          borderRadius='md'
          overflow='hidden'
          display='flex'
          flexDirection='column'
          mb={2}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Flex
            p={4}
            borderBottomWidth={1}
            alignItems='center'
            borderBottomColor={useColorModeValue('purple.200', 'purple.600')}
          >
            <Heading size='md' color={textColor}>
              ChatBot
            </Heading>
          </Flex>
          <VStack
            height='60vh'
            overflowY='auto'
            spacing={4}
            p={4}
            alignItems='stretch'
          >
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
                  px={4}
                  py={2}
                  maxWidth='70%'
                >
                  {message.role === 'user' ? (
                    <Text fontSize='md'>{message.content}</Text>
                  ) : (
                    <AssistantResponse content={message.content} />
                  )}
                </Box>
              </Flex>
            ))}
            {isLoading && (
              <Flex justifyContent='center' alignItems='center' width='100%'>
                <Spinner
                  thickness='2px'
                  speed='0.65s'
                  emptyColor={useColorModeValue('purple.100', 'purple.700')}
                  color={buttonColor}
                  size='sm'
                />
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>
          <Box p={4}>
            <form onSubmit={handleSubmit}>
              <Flex>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='Type a message...'
                  bg={inputBgColor}
                  borderRadius='md'
                  pr={10}
                  flex={1}
                  _placeholder={{
                    color: useColorModeValue('purple.400', 'purple.300')
                  }}
                />
                <IconButton
                  aria-label='Send message'
                  icon={<FaPaperPlane />}
                  type='submit'
                  colorScheme='purple'
                  bg={buttonColor}
                  _hover={{ bg: useColorModeValue('purple.500', 'purple.400') }}
                  position='absolute'
                  right={4}
                  zIndex={2}
                />
              </Flex>
            </form>
          </Box>
        </Box>
      </Fade>
      {!isOpen && (
        <Box
          position='absolute'
          bottom={0}
          left={0}
          right={0}
          height={12}
          bg='transparent'
          cursor='pointer'
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsOpen(true)}
        />
      )}
    </Box>
  )
}

export default FadeInChatComponent
