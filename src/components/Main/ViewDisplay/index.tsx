import React, { useState } from 'react'

import { Flex } from '@chakra-ui/react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor
} from '@codesandbox/sandpack-react'

import { useAppSelector } from '../../../redux/hooks'

const ViewDisplay = () => {
  const view = useAppSelector((state) => state.viewToggle.view)

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

  return (
    <Flex h='100vh' w='100%'>
      <SandpackProvider
        template='react'
        theme='auto'
        options={{
          classes: {
            'sp-wrapper': 'custom-wrapper',
            'sp-layout': 'custom-layout',
            'sp-tab-button': 'custom-tab'
          }
        }}
      >
        <SandpackLayout>
          {view === 'Code' ? <SandpackCodeEditor /> : <SandpackPreview />}
        </SandpackLayout>
      </SandpackProvider>
    </Flex>
  )
}

export default ViewDisplay
