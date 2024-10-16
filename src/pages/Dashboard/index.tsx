import React, { useState, useEffect } from 'react'
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
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Icon,
  keyframes,
  Divider,
  Select
} from '@chakra-ui/react'
import { FiPlus, FiCode, FiLayers } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged, User, getIdToken } from 'firebase/auth'
import { get, post } from '../../utils/api'
import { useAppSelector } from '../../redux/hooks'

interface Project {
  id: string
  name: string
  // lastModified: string
}

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const ProjectTile: React.FC<{ project: Project }> = ({ project }) => {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('purple.100', 'purple.600')
  const iconColor = useColorModeValue('purple.500', 'purple.200')

  return (
    <Box
      borderWidth='1px'
      borderRadius='lg'
      borderColor={borderColor}
      overflow='hidden'
      bg={bgColor}
      transition='all 0.3s'
      _hover={{ shadow: 'lg', transform: 'translateY(-5px)' }}
      cursor='pointer'
      onClick={() => navigate(`/design/${project.id}`)}
      height='100%'
      display='flex'
      flexDirection='column'
    >
      <Flex direction='column' p={6} flex={1}>
        <Flex align='center' mb={4}>
          <Icon as={FiLayers} fontSize='3xl' color={iconColor} mr={3} />
          <Heading
            size='md'
            color={useColorModeValue('purple.600', 'purple.200')}
          >
            {project.name}
          </Heading>
        </Flex>
        <Divider mb={4} />
        <Flex justify='space-between' align='center'>
          <Badge colorScheme='purple'>UI</Badge>
        </Flex>
      </Flex>
    </Box>
  )
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const toast = useToast()
  const auth = getAuth()

  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('')

  const floatAnimation = `${float} 3s ease-in-out infinite`

  const fetchProjects = async (currentUser: User) => {
    setIsLoading(true)
    setError(null)
    try {
      const idToken = await getIdToken(currentUser)
      const response = await get<Project[]>(`/projects`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
      setProjects(response.data)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to fetch projects. Please try again later.')
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (auth.currentUser) {
      fetchProjects(auth.currentUser)
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        fetchProjects(currentUser)
      } else {
        setIsLoading(false)
        navigate('/not-authenticated')
      }
    })

    return () => unsubscribe()
  }, [])

  const defaultCode = `import { ChakraProvider, Box, Heading, Text, Stack, Input, Button } from '@chakra-ui/react'

  function App() {
    return (
      <ChakraProvider>
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
      </ChakraProvider>
    );
  }

  export default App;`

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user === null || newProjectName.trim() === '') {
      return
    }

    try {
      const idToken = await getIdToken(user)
      const response = await post<{ projectid: string }>(
        `/projects`,
        {
          name: newProjectName,
          code: defaultCode,
          framework: selectedFramework
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
      const projectID = response.data['projectid']
      setIsModalOpen(false)
      setNewProjectName('')
      navigate(`/design/${projectID}`)
    } catch (err) {
      console.error('Error creating project:', err)
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  if (!user) {
    return (
      <Box
        minHeight='100vh'
        bg={bgColor}
        display='flex'
        alignItems='center'
        justifyContent='center'
      >
        <Text>Please sign in to view your projects.</Text>
      </Box>
    )
  }

  return (
    <Box minHeight='100vh' bg={bgColor}>
      <Flex
        as='header'
        align='center'
        justify='space-between'
        wrap='wrap'
        padding='1.5rem'
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        boxShadow='sm'
      >
        <Heading
          as='h1'
          size='lg'
          color={useColorModeValue('purple.600', 'purple.300')}
        >
          My Designs
        </Heading>
        <Button
          leftIcon={<FiPlus />}
          onClick={() => setIsModalOpen(true)}
          colorScheme='purple'
          size='md'
          fontWeight='bold'
          _hover={{ bg: 'purple.500' }}
        >
          Create New Design
        </Button>
      </Flex>

      <Box maxWidth='1200px' margin='auto' padding={8}>
        <VStack spacing={8} align='stretch'>
          {!isLoading && projects.length > 0 && (
            <StatGroup>
              <Stat>
                <StatLabel
                  color={useColorModeValue('purple.600', 'purple.300')}
                >
                  Total Designs
                </StatLabel>
                <StatNumber>{projects.length}</StatNumber>
              </Stat>
            </StatGroup>
          )}

          {isLoading ? (
            <Flex justify='center' align='center' height='50vh'>
              <Spinner size='xl' color='purple.500' />
            </Flex>
          ) : error ? (
            <Text color='red.500' textAlign='center'>
              {error}
            </Text>
          ) : projects.length === 0 ? (
            <VStack spacing={4} align='center'>
              <Text textAlign='center' fontSize='xl'>
                You currently have no designs.
              </Text>
              <Icon
                as={FiCode}
                boxSize={16}
                color='purple.400'
                animation={floatAnimation}
              />
              <Button
                onClick={() => setIsModalOpen(true)}
                colorScheme='purple'
                size='lg'
                fontWeight='bold'
                _hover={{ bg: 'purple.500' }}
              >
                Create Your First Design
              </Button>
            </VStack>
          ) : (
            <Grid
              templateColumns='repeat(auto-fill, minmax(280px, 1fr))'
              gap={6}
            >
              {projects.map((project) => (
                <ProjectTile key={project.id} project={project} />
              ))}
            </Grid>
          )}
        </VStack>
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
      >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(15deg)'
        />
        <ModalContent
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius='md'
          boxShadow='xl'
        >
          <ModalHeader
            borderBottomWidth='1px'
            borderColor={useColorModeValue('purple.100', 'purple.700')}
            color={useColorModeValue('purple.700', 'purple.200')}
          >
            Create New Project
          </ModalHeader>
          <ModalCloseButton
            color={useColorModeValue('purple.500', 'purple.200')}
          />
          <ModalBody pt={6}>
            <form onSubmit={handleCreateProject}>
              <FormControl>
                <FormLabel
                  color={useColorModeValue('purple.600', 'purple.300')}
                >
                  Project Name
                </FormLabel>
                <Input
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder='Enter project name'
                  borderColor={useColorModeValue('purple.300', 'purple.500')}
                  _hover={{
                    borderColor: useColorModeValue('purple.400', 'purple.400')
                  }}
                  _focus={{
                    borderColor: useColorModeValue('purple.500', 'purple.300'),
                    boxShadow: `0 0 0 1px ${useColorModeValue(
                      'purple.500',
                      'purple.300'
                    )}`
                  }}
                />
                <FormControl mt={4}>
                  <FormLabel
                    color={useColorModeValue('purple.600', 'purple.300')}
                  >
                    UI Framework
                  </FormLabel>
                  <Select
                    placeholder='Select UI framework'
                    value={selectedFramework}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    borderColor={useColorModeValue('purple.300', 'purple.500')}
                    _hover={{
                      borderColor: useColorModeValue(
                        'purple.400',
                        'purple.300'
                      ),
                      bg: useColorModeValue('purple.50', 'purple.700')
                    }}
                    _focus={{
                      borderColor: useColorModeValue(
                        'purple.500',
                        'purple.300'
                      ),
                      boxShadow: `0 0 0 1px ${useColorModeValue(
                        'purple.500',
                        'purple.300'
                      )}`
                    }}
                  >
                    <option value='' disabled>
                      Select UI framework
                    </option>
                    <option value='Shadcn UI'>Shadcn UI</option>
                    <option value='Material UI'>Material UI</option>
                    <option value='Chakra UI'>Chakra UI</option>
                    <option value='Tailwind CSS'>Tailwind CSS</option>
                  </Select>
                </FormControl>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleCreateProject}
              bg={useColorModeValue('purple.500', 'purple.200')}
              color={useColorModeValue('white', 'gray.800')}
              _hover={{ bg: useColorModeValue('purple.600', 'purple.300') }}
              mr={3}
            >
              Create
            </Button>
            <Button
              variant='ghost'
              onClick={() => setIsModalOpen(false)}
              color={useColorModeValue('purple.500', 'purple.200')}
              _hover={{ bg: useColorModeValue('purple.50', 'purple.700') }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Dashboard
