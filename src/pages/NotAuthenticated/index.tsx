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
  Flex,
  Image
} from '@chakra-ui/react'
import { FaLock, FaHome, FaSignInAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import Logo from '../../assets/images/logo.svg'

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`

const NotAuthenticated = () => {
  const navigate = useNavigate()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'gray.100')

  return (
    <Flex
      minHeight='100vh'
      bg={bgColor}
      color={textColor}
      align='center'
      justify='center'
    >
      <Container maxW='container.xl' py={20}>
        <VStack spacing={8} textAlign='center'>
          {/* Logo placeholder */}
          {/* <Image
            src={Logo}
            alt='Augment Logo'
            boxSize={24}
            filter={useColorModeValue(
              'brightness(0) saturate(100%) invert(14%) sepia(100%) saturate(5000%) hue-rotate(280deg) brightness(100%) contrast(100%)',
              'brightness(0) saturate(100%) invert(80%) sepia(100%) saturate(500%) hue-rotate(280deg) brightness(100%) contrast(100%)'
            )}
          /> */}

          {/* Animated lock icon */}
          {/* <Box animation={`${float} 3s ease-in-out infinite`} mb={8}>
            <Icon as={FaLock} w={20} h={20} color='purple.400' />
          </Box> */}

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
                navigate('/', { replace: true })
                // console.log('Go to home')
              }}
            >
              Go to Home
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Flex>
  )
}

export default NotAuthenticated
