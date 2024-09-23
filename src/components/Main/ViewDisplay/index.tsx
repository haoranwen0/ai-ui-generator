import React, { useState } from 'react'

import { Box, Button, ChakraProvider, Flex } from '@chakra-ui/react'
import MonacoEditor from '@monaco-editor/react'
import { LivePreview, LiveProvider } from 'react-live'
import * as ChakraUI from '@chakra-ui/react'

import ErrorBoundary from '../../ErrorBoundary'
import { useAppSelector } from '../../../redux/hooks'

const ViewDisplay = () => {
  const view = useAppSelector((state) => state.viewToggle.view)

  console.log(view)

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
  const [error, setError] = useState(null)

  return (
    <Flex h='100vh'>
      <Box w='100%' h='100%' overflow='auto'>
        {view === 'Code' ? (
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
        ) : (
          <ErrorBoundary>
            <ChakraProvider>
              <LiveProvider code={code} scope={ChakraUI}>
                <LivePreview />
              </LiveProvider>
            </ChakraProvider>
          </ErrorBoundary>
        )}
      </Box>
    </Flex>
  )
}

export default ViewDisplay
