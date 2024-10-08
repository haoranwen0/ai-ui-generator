import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth, onAuthStateChanged, User, getIdToken } from 'firebase/auth';

interface Project {
  id: string;
  name: string;
}

const ProjectTile: React.FC<{ project: Project }> = ({ project }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      overflow="hidden"
      bg={bgColor}
      transition="all 0.3s"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      cursor="pointer"
      onClick={() => navigate(`/design/${project.id}`)}
    >
      <Box p={4}>
        <Heading size="md" mb={2}>
          {project.name}
        </Heading>
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const toast = useToast();
  const auth = getAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProjects(currentUser);
      } else {
        setIsLoading(false);
        setError('Please sign in to view your projects.');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchProjects = async (currentUser: User) => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await getIdToken(currentUser);
      const response = await axios.get<Project[]>('http://127.0.0.1:5001/ai-ui-generator/us-central1/main/projects', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (user === null || newProjectName.trim() === '') {
      return;
    }
    try {
      const idToken = await getIdToken(user);
      const response = await axios.post('http://127.0.0.1:5001/ai-ui-generator/us-central1/main/projects',
        { name: newProjectName, code: '' },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      const projectID = response.data['projectid'];
      setIsModalOpen(false);
      setNewProjectName('');
      navigate(`/design/${projectID}`);
    } catch (err) {
      console.error('Error creating project:', err);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!user) {
    return (
      <Box minHeight="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Text>Please sign in to view your projects.</Text>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={bgColor}>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        boxShadow="sm"
      >
        <Heading as="h1" size="lg">
          My Projects
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          onClick={() => setIsModalOpen(true)}
          colorScheme="purple"
        >
          Create New Project
        </Button>
      </Flex>

      <Box maxWidth="1200px" margin="auto" padding={8}>
        {isLoading ? (
          <Flex justify="center" align="center" height="50vh">
            <Spinner size="xl" color="purple.500" />
          </Flex>
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        ) : projects.length === 0 ? (
          <Text textAlign="center">
            You currently have no projects.
          </Text>
        ) : (
          <Grid
            templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap={6}
          >
            {projects.map((project) => (
              <ProjectTile key={project.id} project={project} />
            ))}
          </Grid>
        )}
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateProject}>
              Create
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Flex,
//   Grid,
//   Heading,
//   Text,
//   VStack,
//   useColorModeValue,
//   Spinner,
//   useToast,
// } from '@chakra-ui/react';
// import { FiPlus } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Make sure to install axios: npm install axios
// // import { useAppSelector } from '../../redux/hooks'
// // import { auth } from "../..";
// import { getAuth, getIdToken } from 'firebase/auth';


// interface Project {
//   id: string;
//   name: string;
//   lastModified: string;
//   // Add any other properties that your project objects contain
// }

// const ProjectTile: React.FC<{ project: Project }> = ({ project }) => {
//   const navigate = useNavigate();
//   const bgColor = useColorModeValue('white', 'gray.700');
//   const borderColor = useColorModeValue('gray.200', 'gray.600');

//   return (
//     <Box
//       borderWidth="1px"
//       borderRadius="lg"
//       borderColor={borderColor}
//       overflow="hidden"
//       bg={bgColor}
//       transition="all 0.3s"
//       _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
//       cursor="pointer"
//       onClick={() => navigate(`/main-app-page/${project.id}`)}
//     >
//       <Box p={4}>
//         <Heading size="md" mb={2}>
//           {project.name}
//         </Heading>
//         <Text fontSize="sm" color="gray.500">
//           Last modified: {new Date(project.lastModified).toLocaleDateString()}
//         </Text>
//       </Box>
//     </Box>
//   );
// };

// const Dashboard: React.FC = () => {
//   const auth = getAuth();

//   const navigate = useNavigate();
//   const bgColor = useColorModeValue('gray.50', 'gray.900');
//   const toast = useToast();

//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     // console.log(user);

//     // console.log('After NULL USER')

//     // console.log(await user.getIdToken())

//     setIsLoading(true);
//     setError(null);

//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         console.log('not working');
//         throw new Error('No user is signed in');
//       }
  
//       // Get the ID token
//       const idToken = await getIdToken(user);

//       console.log(idToken);

//       // Replace 'YOUR_API_ENDPOINT' with the actual endpoint for fetching projects
//       const response = await axios.get<Project[]>('http://127.0.0.1:5001/ai-ui-generator/us-central1/main/projects', {
//         headers: {
//           Authorization: `Bearer ${idToken}`
//         }
//       });
//       setProjects(response.data);
//     } catch (err) {
//       setError('Failed to fetch projects. Please try again later.');
//       toast({
//         title: 'Error',
//         description: 'Failed to fetch projects. Please try again later.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateProject = () => {
//     // Logic to create a new project
//     console.log('Creating a new project');
//     // Navigate to the project creation page or open a modal
//     // For example:
//     // navigate('/create-project');
//   };

//   return (
//     <Box minHeight="100vh" bg={bgColor}>
//       <Flex
//         as="header"
//         align="center"
//         justify="space-between"
//         wrap="wrap"
//         padding="1.5rem"
//         bg={useColorModeValue('white', 'gray.800')}
//         color={useColorModeValue('gray.600', 'white')}
//         boxShadow="sm"
//       >
//         <Heading as="h1" size="lg">
//           My Projects
//         </Heading>
//         <Button
//           leftIcon={<FiPlus />}
//           onClick={handleCreateProject}
//           colorScheme="purple"
//         >
//           Create New Project
//         </Button>
//       </Flex>

//       <Box maxWidth="1200px" margin="auto" padding={8}>
//         {isLoading ? (
//           <Flex justify="center" align="center" height="50vh">
//             <Spinner size="xl" color="purple.500" />
//           </Flex>
//         ) : error ? (
//           <Text color="red.500" textAlign="center">
//             {error}
//           </Text>
//         ) : (
//           <Grid
//             templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
//             gap={6}
//           >
//             {projects.map((project) => (
//               <ProjectTile key={project.id} project={project} />
//             ))}
//           </Grid>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;