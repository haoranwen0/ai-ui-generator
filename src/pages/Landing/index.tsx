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
  Image
} from '@chakra-ui/react'
import { FiCode, FiZap } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import HeroBG from '../../assets/images/hero_bg.png'

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
      <Flex align='center' mr={5}>
        <Heading as='h1' size='lg' letterSpacing={'tighter'}>
          Augment
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
                console.log('Get early access!')
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
              Get Early Access
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

const Landing: React.FC = () => {
  return (
    <Box>
      <Header />
      <Hero />
    </Box>
  )
}

export default Landing
