import React, { ReactNode, useState } from 'react'

import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import * as ChakraUI from '@chakra-ui/react'
import MonacoEditor from '@monaco-editor/react'
import { LiveError, LivePreview, LiveProvider } from 'react-live'

import { ButtonCounterExample, ThemeToggle, ViewToggle } from '../../components'
import ErrorBoundary from '../../components/ErrorBoundary'

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
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [code, setCode] = useState(`
function App() {
  return (
    <Box p={4}>
      <Heading mb={4}>Hello, Chakra UI!</Heading>
      <Text mb={2}>This is a sample component using Chakra UI.</Text>
      <Stack spacing={3}>
        <Input placeholder="Enter your name" />
        <Button colorScheme="blue">
          Click me
        </Button>
      </Stack>
    </Box>
  );
}
`)
  const [runningCode, setRunningCode] = useState(code)
  const [error, setError] = useState(null)

  const handleRunCode = () => {
    setError(null)
    setRunningCode(code)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      onOpen()
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <ThemeToggle />
      <Box mb={4}>
        <ViewToggle />
      </Box>
      <Button colorScheme='green' onClick={handleRunCode}>
        Run Code
      </Button>
      <Flex h='100vh'>
        <Box w='50%' overflow='auto'>
          <MonacoEditor
            height='100%'
            language='typescript'
            theme='vs-dark'
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              // Disable error highlighting
              renderValidationDecorations: 'off'
            }}
            beforeMount={(monaco) => {
              // Disable all markers (error squiggles)
              // monaco.editor.setModelMarkers = () => {}
            }}
          />
          {/* <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            height='200px'
            fontFamily='monospace'
          /> */}
        </Box>
        <Box w='50%' overflow='auto'>
          <ErrorBoundary
            fallback={(error, resetErrorBoundary) => (
              <ChakraUI.Alert status='error'>
                <ChakraUI.AlertIcon />
                <ChakraUI.AlertTitle>Error:</ChakraUI.AlertTitle>
                <ChakraUI.AlertDescription>
                  {error.message}
                </ChakraUI.AlertDescription>
                <ChakraUI.Button onClick={resetErrorBoundary} ml={3}>
                  Reset
                </ChakraUI.Button>
              </ChakraUI.Alert>
            )}
            onError={(error, info) => console.log('Logged error:', error, info)}
          >
            <ChakraProvider>
              <LiveProvider code={runningCode} scope={ChakraUI}>
                <LivePreview />
              </LiveProvider>
            </ChakraProvider>
          </ErrorBoundary>
        </Box>
      </Flex>
      <ButtonCounterExample />
      <Button onClick={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat Interface</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction='column' height='400px'>
              <Box flex='1' overflowY='auto' mb={4}>
                {initialMessages.map((message) => (
                  <Flex
                    key={message.id}
                    justifyContent={
                      message.sender === 'user' ? 'flex-end' : 'flex-start'
                    }
                    mb={2}
                  >
                    <Box
                      bg={message.sender === 'user' ? 'blue.100' : 'gray.100'}
                      color={
                        message.sender === 'user' ? 'blue.800' : 'gray.800'
                      }
                      borderRadius='lg'
                      px={3}
                      py={2}
                      maxWidth='70%'
                    >
                      {message.text}
                    </Box>
                  </Flex>
                ))}
              </Box>
              <Flex as='form' onSubmit={(e) => e.preventDefault()}>
                <Input placeholder='Type a message...' mr={2} />
                <Button colorScheme='blue' type='submit'>
                  Send
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Main
