import React from 'react'

import { ViewDisplay, HoverChatComponent, IconControls } from '../../components'
import { Box } from '@chakra-ui/react'

const Main: React.FC = () => {
  return (
    <Box w='100%' h='100vh' bg='red.300'>
      <ViewDisplay />
      <HoverChatComponent />
      <IconControls />
    </Box>
  )
}

export default Main
