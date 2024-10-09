import React from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  keyframes,
  Image,
  Link
} from '@chakra-ui/react'
import { FiCode, FiZap } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import HeroBG from '../../assets/images/hero_bg.png'
import Logo from '../../assets/images/logo.svg'

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`

const Header = () => {
  const navigate = useNavigate()

  return (
    <Flex
      as='header'
      align='center'
      justify='space-between'
      wrap='wrap'
      padding='1.5rem'
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      // position='fixed'
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Flex align='center' gap={2}>
        <Image
          src={Logo}
          alt='Augment Logo'
          boxSize={8}
          filter={useColorModeValue(
            'brightness(0) saturate(100%) invert(14%) sepia(100%) saturate(5000%) hue-rotate(280deg) brightness(100%) contrast(100%)',
            'brightness(0) saturate(100%) invert(80%) sepia(100%) saturate(500%) hue-rotate(280deg) brightness(100%) contrast(100%)'
          )}
        />
        <Heading as='h1' size='lg' letterSpacing={'tighter'}>
          Augment UI
        </Heading>
      </Flex>

      <Box>
        <Button
          onClick={() => {
            navigate('/auth')
          }}
          fontSize='sm'
          fontWeight={600}
          color={'white'}
          bg={'purple.400'}
          _hover={{
            bg: 'purple.300'
          }}
        >
          Get Started
        </Button>
      </Box>
    </Flex>
  )
}

const Hero = () => {
  const navigate = useNavigate()

  const floatAnimation = `${float} 3s ease-in-out infinite`

  return (
    <Flex
      dir='column'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Container maxW='container.xl' height='100%'>
        <Flex
          align='center'
          justify='center'
          height='100%'
          direction='column'
          textAlign='center'
        >
          <VStack spacing={8} my={16}>
            <Heading
              as='h2'
              size='4xl'
              color={useColorModeValue('gray.800', 'white')}
              fontWeight='bold'
              bgGradient='linear(to-r, purple.400, pink.400)'
              bgClip='text'
            >
              AI-Powered UI Generation
            </Heading>
            <Text
              fontSize='xl'
              color={useColorModeValue('gray.600', 'gray.300')}
              maxW='2xl'
            >
              Create stunning user interfaces with the power of AI. Just
              describe what you want, and we&apos;ll generate the code for you.
            </Text>
            <Button
              rightIcon={<FiZap />}
              onClick={() => {
                navigate('/auth')
              }}
              size='lg'
              fontSize='md'
              rounded='full'
              color={'white'}
              bg={'purple.400'}
              _hover={{
                bg: 'purple.300'
              }}
              px={8}
            >
              Get Started
            </Button>
          </VStack>

          {/* Placeholder for image */}
          {/* <Box
            width='80%'
            maxW='800px'
            height='400px'
            bg='gray.200'
            rounded='md'
            display='flex'
            alignItems='center'
            justifyContent='center'
          > */}
          <Image
            src={HeroBG}
            objectFit='contain'
            h='100%'
            w='80%'
            rounded='lg'
          />
          {/* </Box> */}

          <Box
            as={FiCode}
            size='100px'
            color={useColorModeValue('purple.500', 'purple.300')}
            mt={16}
            animation={floatAnimation}
          />
        </Flex>
      </Container>
    </Flex>
  )
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      as='footer'
      bg={useColorModeValue('gray.100', 'gray.900')}
      color={useColorModeValue('gray.600', 'gray.400')}
      py={4}
      px={4}
    >
      <Container maxW='container.xl'>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align='center'
        >
          <Text fontSize='sm'>
            © {currentYear} Augment. All rights reserved.
          </Text>
          <Link
            href='mailto:contact@augment.com'
            fontSize='sm'
            mt={{ base: 2, md: 0 }}
          >
            contact@augment.com
          </Link>
        </Flex>
      </Container>
    </Box>
  )
}

const Landing: React.FC = () => {
  return (
    <Box>
      <Header />
      <Hero />
      <Footer />
    </Box>
  )
}

export default Landing
