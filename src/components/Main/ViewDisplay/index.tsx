import React, { useState, useEffect } from 'react'
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
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User, getIdToken } from 'firebase/auth';

const ViewDisplay = () => {
  const view = useAppSelector((state) => state.viewToggle.view)
  const code = useAppSelector((state) => state.codeEditor.value)
  // const [code, setCode] = useSta

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();

  const { designID } = useParams();

  // const [content, setContent] = useState('');
  // const [lastSavedContent, setLastSavedContent] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      // fetchCode(currentUser);
    } else {
      setUser(null);
      setIsLoading(false);
      setError('Please sign in to view your projects.');
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // fetchCode(currentUser);
      } else {
        setIsLoading(false);
        setError('Please sign in to view your projects.');
        // Optionally, redirect to login page
        // navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  // const fetchCode = async (currentUser: User) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const idToken = await getIdToken(currentUser);
  //     console.log("token", idToken);

  //     const response = await axios.get(`http://127.0.0.1:5001/ai-ui-generator/us-central1/main/project/${designID}`, {
  //       headers: {
  //         Authorization: `Bearer ${idToken}`,
  //       },
  //     });

  //     setProjects(response.data);
  //   } catch (err) {
  //     console.error('Error fetching projects:', err);
  //     setError('Failed to fetch projects. Please try again later.');
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to fetch projects. Please try again later.',
  //       status: 'error',
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveContent();
    }, 5000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, []);

  const saveContent = async () => {
    console.log('saving content');
    console.log(user);
    if (user === null) {
      return;
    }
    try {
      const idToken = await getIdToken(user);
  
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
