import React from 'react'

import { Box, Button, Flex, Input } from '@chakra-ui/react'

import {
  ThemeToggle,
  ViewToggle,
  ViewDisplay,
  HoverChatComponent,
  IconControls
} from '../../components'

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
      <ViewDisplay />
      <HoverChatComponent />
      <IconControls />
    </>
  )
}

export default Main
