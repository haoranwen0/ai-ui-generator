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
  Fade
} from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import QuestionsContainer, { Question } from '../Questions'

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

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

const FadeInChatComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'gray.100')
  const inputBgColor = useColorModeValue('gray.100', 'gray.700')
  const botMessageBg = useColorModeValue('gray.100', 'gray.700')
  const userMessageBg = useColorModeValue('blue.500', 'blue.400')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: 'user'
      }
      setMessages([...messages, newMessage])
      setInputValue('')
      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: `This is a simulated response to: "${inputValue}"`,
          sender: 'bot'
        }
        setMessages((prevMessages) => [...prevMessages, botResponse])
      }, 1000)
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
          <Flex p={4} borderBottomWidth={1} alignItems='center'>
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
            {messages.map((message) => (
              <Flex
                flexDir='column'
                key={message.id}
                justifyContent={
                  message.sender === 'user' ? 'flex-end' : 'flex-start'
                }
              >
                <Box
                  bg={message.sender === 'user' ? userMessageBg : botMessageBg}
                  color={message.sender === 'user' ? 'white' : textColor}
                  borderRadius='md'
                  px={4}
                  py={2}
                  maxWidth='70%'
                >
                  <Text fontSize='md'>{message.text}</Text>
                </Box>
                {message.sender === 'bot' && (
                  <QuestionsContainer questions={questions} />
                )}
              </Flex>
            ))}
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
                />
                <IconButton
                  aria-label='Send message'
                  icon={<FaPaperPlane />}
                  type='submit'
                  colorScheme='blue'
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
