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
  Spinner,
  Kbd,
  Icon
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
  const dispatch = useDispatch()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('purple.800', 'purple.100')
  const inputBgColor = useColorModeValue('purple.100', 'purple.700')
  const botMessageBg = useColorModeValue('purple.100', 'purple.700')
  const userMessageBg = useColorModeValue('purple.300', 'purple.500')
  const buttonColor = useColorModeValue('purple.400', 'purple.300')

  const user = useAppSelector((state) => state.user.user)
  const isLoading = useAppSelector(selectIsLoading)

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
      bottom={0}
      left='50%'
      transform='translateX(-50%)'
      width='50%'
      maxWidth='600px'
      zIndex={1000}
    >
      <Box
        bg={isHistoryOpen ? bgColor : 'transparent'}
        boxShadow='xl'
        borderRadius='md'
        overflow='hidden'
        display='flex'
        flexDirection='column'
        mb={2}
        onMouseEnter={() => setIsHistoryOpen(true)}
        onMouseLeave={() => setIsHistoryOpen(false)}
      >
        <Fade in={isHistoryOpen} unmountOnExit>
          <Flex
            p={4}
            borderBottomWidth={1}
            alignItems='center'
            borderBottomColor={useColorModeValue('purple.100', 'purple.800')}
          >
            <Heading size='md' color={textColor}>
              Augment AI
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
        </Fade>
        <Box p={4} bg='transparent'>
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
                  opacity: 1
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
              >
                <Icon as={FaPaperPlane} color={buttonColor} />
              </Flex>
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default FadeInChatComponent
