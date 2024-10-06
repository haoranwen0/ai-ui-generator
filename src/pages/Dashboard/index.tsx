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
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios

interface Project {
  id: string;
  name: string;
  lastModified: string;
  // Add any other properties that your project objects contain
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
      onClick={() => navigate(`/main-app-page/${project.id}`)}
    >
      <Box p={4}>
        <Heading size="md" mb={2}>
          {project.name}
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Last modified: {new Date(project.lastModified).toLocaleDateString()}
        </Text>
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const toast = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace 'YOUR_API_ENDPOINT' with the actual endpoint for fetching projects
      const response = await axios.get<Project[]>('http://127.0.0.1:5001/ai-ui-generator/us-central1/main/projects');
      setProjects(response.data);
    } catch (err) {
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

  const handleCreateProject = () => {
    // Logic to create a new project
    console.log('Creating a new project');
    // Navigate to the project creation page or open a modal
    // For example:
    // navigate('/create-project');
  };

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
          onClick={handleCreateProject}
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
    </Box>
  );
};

export default Dashboard;