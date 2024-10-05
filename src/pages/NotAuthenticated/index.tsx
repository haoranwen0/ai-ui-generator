import React from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  keyframes,
  Container,
  Flex
} from '@chakra-ui/react'
import { FaLock, FaHome, FaSignInAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`

const NotAuthenticated = () => {
  const navigate = useNavigate()

  const bgColor = useColorModeValue('purple.50', 'purple.900')
  const textColor = useColorModeValue('purple.800', 'purple.100')
  const buttonColor = useColorModeValue('purple.600', 'purple.300')

  return (
    <Box minHeight='100vh' bg={bgColor} color={textColor}>
      <Container maxW='container.xl' py={20}>
        <VStack spacing={8} textAlign='center'>
          {/* Logo placeholder */}
          <Box
            width='100px'
            height='100px'
            bg='purple.200'
            borderRadius='full'
            display='flex'
            alignItems='center'
            justifyContent='center'
            mb={8}
          >
            <Text fontSize='2xl' fontWeight='bold'>
              LOGO
            </Text>
          </Box>

          {/* Animated lock icon */}
          <Box animation={`${float} 3s ease-in-out infinite`} mb={8}>
            <Icon as={FaLock} w={20} h={20} color='purple.400' />
          </Box>

          <Heading size='2xl' mb={4}>
            Authentication Required
          </Heading>
          <Text fontSize='xl' maxW='lg' mb={8}>
            Oops! It seems you&apos;re trying to access a secure page without
            being authenticated. Please sign in to continue.
          </Text>

          <Flex
            direction={['column', 'row']}
            width='100%'
            justifyContent='center'
            gap={4}
          >
            <Button
              leftIcon={<Icon as={FaSignInAlt} />}
              colorScheme='purple'
              size='lg'
              width={['full', 'auto']}
              onClick={() => {
                navigate('/auth', { replace: true })
              }}
            >
              Sign In
            </Button>
            <Button
              leftIcon={<Icon as={FaHome} />}
              variant='outline'
              colorScheme='purple'
              size='lg'
              width={['full', 'auto']}
              onClick={() => {
                console.log('Go to home')
              }}
            >
              Go to Home
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  )
}

export default NotAuthenticated
