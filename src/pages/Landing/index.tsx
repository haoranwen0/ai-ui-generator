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
  keyframes
} from '@chakra-ui/react'
import { FiCode, FiZap } from 'react-icons/fi'

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`

// TypeScript interfaces
interface HeaderProps {
  onWaitlistClick: () => void
}

interface HeroProps {
  onGetEarlyAccess: () => void
}

const Header: React.FC<HeaderProps> = ({ onWaitlistClick }) => {
  return (
    <Flex
      as='header'
      align='center'
      justify='space-between'
      wrap='wrap'
      padding='1.5rem'
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      position='fixed'
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Flex align='center' mr={5}>
        <Heading as='h1' size='lg' letterSpacing={'tighter'}>
          AI UI Framework
        </Heading>
      </Flex>

      <Box>
        <Button
          onClick={onWaitlistClick}
          fontSize='sm'
          fontWeight={600}
          color={'white'}
          bg={'purple.400'}
          _hover={{
            bg: 'purple.300'
          }}
        >
          Join Waitlist
        </Button>
      </Box>
    </Flex>
  )
}

const Hero: React.FC<HeroProps> = ({ onGetEarlyAccess }) => {
  const floatAnimation = `${float} 3s ease-in-out infinite`

  return (
    <Box
      minHeight='100vh'
      bg={useColorModeValue('gray.50', 'gray.900')}
      pt='calc(80px)' // Add padding top to account for fixed header
    >
      <Container maxW='container.xl' height='100%'>
        <Flex
          align='center'
          justify='center'
          height='100%'
          direction='column'
          textAlign='center'
        >
          <VStack spacing={8} mb={16}>
            <Heading
              as='h2'
              size='4xl'
              color={useColorModeValue('gray.800', 'white')}
              fontWeight='bold'
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
              onClick={onGetEarlyAccess}
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
          <Box
            width='80%'
            maxW='800px'
            height='400px'
            bg='gray.200'
            borderRadius='md'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <Text color='gray.500' fontSize='lg'>
              Placeholder for Image
            </Text>
          </Box>

          <Box
            as={FiCode}
            size='100px'
            color={useColorModeValue('purple.500', 'purple.300')}
            mt={16}
            animation={floatAnimation}
          />
        </Flex>
      </Container>
    </Box>
  )
}

const Landing: React.FC = () => {
  const handleWaitlistClick = () => {
    // Implement waitlist logic here
    console.log('Joining waitlist')
  }

  const handleGetEarlyAccess = () => {
    // Implement early access logic here
    console.log('Getting early access')
  }

  return (
    <Box>
      <Header onWaitlistClick={handleWaitlistClick} />
      <Hero onGetEarlyAccess={handleGetEarlyAccess} />
    </Box>
  )
}

export default Landing
