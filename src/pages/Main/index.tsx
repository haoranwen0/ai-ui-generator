import React from 'react'

import { ViewDisplay, HoverChatComponent, IconControls } from '../../components'
import { Box } from '@chakra-ui/react'
import useHasAccess from '../../hooks/useHasAccess'

const Main: React.FC = () => {
  useHasAccess({
    invalidAccessRedirectLink: '/not-authenticated'
  })

  return (
    <Box w='100%' h='100vh'>
      <ViewDisplay />
      <HoverChatComponent />
      <IconControls />
    </Box>
  )
}

export default Main
