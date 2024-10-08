import React, { useState, useEffect } from 'react'
import { Flex, IconButton, Tooltip, Box, Text, useColorModeValue, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { FiHome } from 'react-icons/fi'
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  SandpackFileExplorer,
  SandpackLayout
} from '@codesandbox/sandpack-react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { useNavigate, useParams } from 'react-router-dom';
import { setCode } from '../../../redux/features/codeEditor/codeEditorSlice'
import axios from 'axios';

const ViewDisplay = () => {
  // const dispatch = useAppDispatch()
  const toast = useToast();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user.user)
  // const code = useAppSelector((state) => state.codeEditor.value)
  const [code, setCode] = useState("");
  const { designID } = useParams();


  useEffect(() => {
    // const currentUser = auth.currentUser;
    // if (currentUser) {
    //   setUser(currentUser);
    //   fetchCode(currentUser);
    // } else {
    //   setUser(null);
    //   setIsLoading(false);
    //   setError('Please sign in to view your projects.');
    // }}, []);
    fetchCode();
  }, [user]);

  const fetchCode = async () => {
    // setIsLoading(true);
    // setError(null);
    try {
      const idToken = await user?.getIdToken();
      console.log("token", idToken);

      const response = await axios.get(`http://127.0.0.1:5001/ai-ui-generator/us-central1/main/project/${designID}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setCode(response.data['code']);
    } catch (err) {
      console.error('Error fetching projects:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveContent();
    }, 3000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, []);

  const saveContent = async () => {
    console.log('saving content');
    console.log(user);
    console.log(code);
    if (user === null) {
      return;
    }
    try {
      const idToken = await user.getIdToken();
  
      await axios.patch(`http://127.0.0.1:5001/ai-ui-generator/us-central1/main/project/${designID}`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
      });
      console.log('Code saved successfully');
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

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

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Adjust this path if your dashboard route is different
  };

  const bgColor = useColorModeValue('purple.500', 'purple.600');
  const buttonBgColor = useColorModeValue('purple.400', 'purple.500');
  const buttonHoverBgColor = useColorModeValue('purple.300', 'purple.400');

  return (
    <Flex direction="column" h='100vh' w='100%'>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.5rem"
        bg={bgColor}
        color="white"
        boxShadow="md"
      >
        <Flex align="center">
          <Tooltip label="Back to Dashboard" placement="right">
            <IconButton
              icon={<FiHome />}
              onClick={handleBackToDashboard}
              size="md"
              fontSize="20px"
              variant="solid"
              bg={buttonBgColor}
              _hover={{ bg: buttonHoverBgColor }}
              mr={3}
              aria-label="Back to Dashboard"
            />
          </Tooltip>
        </Flex>
        <Text fontWeight="bold" fontSize="lg">Augment</Text>
      </Flex>
      <Box flex="1">
      <SandpackProvider
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
            recharts: 'latest',
            'react-draggable': 'latest'
          },
          entry: '/index.js'
        }}
        files={{
          '/App.js': currentCode
        }}
        options={{
          classes: {
            'sp-wrapper': 'custom-wrapper',
            'sp-layout': 'custom-layout',
            'sp-tab-button': 'custom-tab',
            'sp-editor': 'custom-editor',
            'sp-preview': 'custom-preview',
            'sp-file-explorer': 'custom-file-explorer'
          }
        }}
      >
        <SandpackLayout>
          <SandpackFileExplorer />
          <CodeEditor />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
      </Box>
    </Flex>
  )
}

const CodeEditor = () => {
  const { code } = useActiveCode()

  useEffect(() => {
    setCode(code)
  }, [code, setCode])

  return (
    <SandpackCodeEditor showTabs showLineNumbers showInlineErrors wrapContent />
  )
}

export default ViewDisplay
