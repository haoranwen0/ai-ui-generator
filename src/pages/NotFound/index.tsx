import React from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Container,
  Button,
  Icon
} from '@chakra-ui/react'
import { FaHome, FaRegSadTear } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface NotFoundPageProps {
  message?: string
}

const NotFound: React.FC<NotFoundPageProps> = ({
  message = "Oops! Looks like you've wandered into uncharted territory."
}) => {
  const navigate = useNavigate()

  return (
    <Box
      minHeight='100vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      bg='gray.900'
    >
      <Container maxW='xl' textAlign='center'>
        <VStack spacing={8}>
          <FaRegSadTear size={80} color='#805AD5' />
          <Heading as='h1' size='4xl' color='purple.300'>
            404
          </Heading>
          <Text fontSize='xl' color='purple.400'>
            {message}
          </Text>
          <Text fontSize='md' color='purple.400'>
            Don&apos;t worry, even the best explorers get lost sometimes!
          </Text>
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
        </VStack>
      </Container>
    </Box>
  )
}

export default NotFound
