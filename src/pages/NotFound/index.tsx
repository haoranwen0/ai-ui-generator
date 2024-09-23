import React from 'react'
import { Box, VStack, Heading, Text, Container } from '@chakra-ui/react'
import { FaRegSadTear } from 'react-icons/fa'

interface NotFoundPageProps {
  message?: string
}

const NotFound: React.FC<NotFoundPageProps> = ({
  message = "Oops! Looks like you've wandered into uncharted territory."
}) => {
  return (
    <Box
      minHeight='100vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      bg='purple.50'
    >
      <Container maxW='xl' textAlign='center'>
        <VStack spacing={8}>
          <FaRegSadTear size={80} color='#805AD5' />
          <Heading as='h1' size='4xl' color='purple.500'>
            404
          </Heading>
          <Text fontSize='xl' color='purple.700'>
            {message}
          </Text>
          <Text fontSize='md' color='purple.600'>
            Don&apos;t worry, even the best explorers get lost sometimes!
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default NotFound
