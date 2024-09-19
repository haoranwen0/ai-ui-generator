import React from 'react'

import { Box, Button, Flex, Input } from '@chakra-ui/react'

import { ThemeToggle, ViewToggle } from '../../components'
import ViewDisplay from '../../components/Main/ViewDisplay'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

const initialMessages: Message[] = [
  { id: 1, text: 'Hello! How can I assist you today?', sender: 'bot' },
  { id: 2, text: 'I have a question about React hooks.', sender: 'user' },
  {
    id: 3,
    text: "Sure, I'd be happy to help. What specific question do you have about React hooks?",
    sender: 'bot'
  }
]

const Main: React.FC = () => {
  return (
    <>
      <Box pos='absolute' top={4} right={4} zIndex={100}>
        <ThemeToggle />
        <ViewToggle />
      </Box>
      <ViewDisplay />
      <Flex
        position='fixed'
        bottom='0'
        left='0'
        right='0'
        flexDir='column'
        justifyContent='flex-end'
        alignItems='center'
        p={4}
      >
        <Box
          flex='1'
          overflowY='auto'
          p={4}
          mb={4}
          width='100%'
          maxWidth='600px'
          opacity={0}
          transition='opacity 0.3s'
          position='absolute'
          bottom='100%'
          left='50%'
          transform='translateX(-50%)'
        >
          {initialMessages.map((message) => (
            <Box
              key={message.id}
              bg={message.sender === 'bot' ? 'blue.100' : 'green.100'}
              color='black'
              p={2}
              borderRadius='md'
              mb={2}
              maxWidth='70%'
              alignSelf={message.sender === 'bot' ? 'flex-start' : 'flex-end'}
            >
              {message.text}
            </Box>
          ))}
        </Box>
        <Flex
          width='100%'
          maxWidth='600px'
          bg='rgba(255, 255, 255, 0.1)'
          borderRadius='md'
          p={2}
          alignItems='center'
          role='group'
          _hover={{
            '& + div': { opacity: 1 }
          }}
        >
          <Input
            placeholder='Type your message...'
            mr={2}
            bg='white'
            color='black'
          />
          <Button colorScheme='blue'>Send</Button>
        </Flex>
      </Flex>
    </>
  )
}

export default Main
