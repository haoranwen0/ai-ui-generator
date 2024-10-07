import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
  useActiveCode,
  Sandpack
} from '@codesandbox/sandpack-react'
import { useAppSelector } from '../../../redux/hooks'
import { setCode } from '../../../redux/features/codeEditor/codeEditorSlice'
import { useDispatch } from 'react-redux'

const ViewDisplay = () => {
  const view = useAppSelector((state) => state.viewToggle.view)
  const code = useAppSelector((state) => state.codeEditor.value)

  console.log('code', code)

  //   const [code, setCode] = useState(`
  // import { ChakraProvider, Box, Heading, Text, Stack, Input, Button } from '@chakra-ui/react'

  // function App() {
  //   return (
  //     <ChakraProvider>
  //       <Box p={4}>
  //         <Heading mb={4}>Hello, Chakra UI!</Heading>
  //         <Text mb={2}>This is a sample component using Chakra UI.</Text>
  //         <Stack spacing={3}>
  //           <Input placeholder="Enter your name" />
  //           <Button colorScheme="blue">
  //             Click me
  //           </Button>
  //         </Stack>
  //       </Box>
  //     </ChakraProvider>
  //   );
  // }

  // export default App;
  // `)

  return (
    <Flex h='100vh' w='100%'>
      <Sandpack
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
            recharts: 'latest'
          },
          entry: '/index.js'
        }}
        files={{
          '/App.js': code
        }}
        options={{
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          classes: {
            'sp-wrapper': 'custom-wrapper',
            'sp-layout': 'custom-layout',
            'sp-tab-button': 'custom-tab',
            'sp-editor': 'custom-editor',
            'sp-preview': 'custom-preview'
          }
        }}
      />
    </Flex>
  )
}

// const CodeEditor = () => {
//   const { code } = useActiveCode()

//   const dispatch = useDispatch()

//   useEffect(() => {
//     console.log('code', code)
//     dispatch(setCode(code))
//   }, [code, dispatch])

//   return <SandpackCodeEditor showInlineErrors={true} />
// }

export default ViewDisplay
