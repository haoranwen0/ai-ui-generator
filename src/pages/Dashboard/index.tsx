import React from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  lastModified: string;
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
          Last modified: {project.lastModified}
        </Text>
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Mock data for projects
  const projects: Project[] = [
    { id: '1', name: 'Project 1', lastModified: '2023-05-01' },
    { id: '2', name: 'Project 2', lastModified: '2023-05-02' },
    { id: '3', name: 'Project 3', lastModified: '2023-05-03' },
    // Add more mock projects as needed
  ];

  const handleCreateProject = () => {
    // Logic to create a new project
    console.log('Creating a new project');
    // Navigate to the project creation page or open a modal
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
        <Grid
          templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          gap={6}
        >
          {projects.map((project) => (
            <ProjectTile key={project.id} project={project} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;