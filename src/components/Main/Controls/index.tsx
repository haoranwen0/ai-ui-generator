import React, { useState } from 'react'
import {
  Box,
  VStack,
  IconButton,
  Tooltip,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Button,
  useDisclosure,
  SlideFade
} from '@chakra-ui/react'
import {
  FaSun,
  FaMoon,
  FaCode,
  FaEye,
  FaCog,
  FaSignOutAlt,
  FaComments
} from 'react-icons/fa'

import { useAppDispatch } from '../../../redux/hooks'
import { setView } from '../../../redux/features/viewToggle/viewToggleSlice'
import { signOut } from 'firebase/auth'
import { auth } from '../../..'

const IconControls = () => {
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { colorMode, toggleColorMode } = useColorMode()
  const [usageRemaining] = useState(15)

  const iconColor = { light: 'purple.600', dark: 'purple.200' }
  const bgColor = { light: 'gray.50', dark: 'gray.900' }

  const icons = [
    // {
    //   name: 'Code Editor',
    //   icon: FaCode,
    //   onClick: () => dispatch(setView('Code'))
    // },
    // {
    //   name: 'Preview',
    //   icon: FaEye,
    //   onClick: () => dispatch(setView('Preview'))
    // },
    // {
    //   name: 'Chat',
    //   icon: FaComments,
    //   onClick: () => {
    //     console.log('Chat button clicked')
    //     // TODO: Implement chat toggle functionality
    //   }
    // }
  ]

  return (
    <Box
      position='fixed'
      bottom={4}
      left={4}
      zIndex={1000}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <SlideFade in={true} offsetX='-20px'>
        <VStack
          spacing={1}
          borderRadius='md'
          p={1}
          boxShadow='md'
          alignItems='flex-start'
        >
          {/* {icons.map((item) => (
            <Tooltip
              key={item.name}
              label={item.name}
              placement='right'
              hasArrow
            >
              <IconButton
                aria-label={item.name}
                icon={<item.icon />}
                variant='ghost'
                color={iconColor[colorMode]}
                _hover={{ bg: 'blue.100', color: 'blue.600' }}
                _active={{ bg: 'blue.200', color: 'blue.700' }}
                onClick={item.onClick}
                transition='all 0.2s'
              />
            </Tooltip>
          ))} */}
          <Popover placement='right-start'>
            <PopoverTrigger>
              <IconButton
                aria-label='Settings'
                icon={<FaCog color='#B794F4' opacity={0.8} />}
                variant='outline'
                color={iconColor[colorMode]}
                _hover={{ bg: 'purple.700', color: 'purple.600', opacity: 0.8 }}
                _active={{
                  bg: 'purple.700',
                  color: 'purple.700',
                  opacity: 0.8
                }}
                transition='all 0.2s'
              />
            </PopoverTrigger>
            <PopoverContent
              width='200px'
              bg={bgColor[colorMode]}
              borderColor={iconColor[colorMode]}
            >
              <PopoverBody>
                <VStack spacing={3} align='stretch'>
                  <Box>
                    <Text fontWeight='bold' fontSize='sm'>
                      Usage Remaining
                    </Text>
                    <Text fontSize='sm'>{usageRemaining} credits</Text>
                  </Box>
                  {/* <Box>
                    <Text fontWeight='bold' fontSize='sm' mb={1}>
                      Theme
                    </Text>
                    <Button
                      leftIcon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                      onClick={toggleColorMode}
                      colorScheme='purple'
                      size='sm'
                      variant='outline'
                      width='100%'
                    >
                      {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                    </Button>
                  </Box> */}
                  <Button
                    leftIcon={<FaSignOutAlt />}
                    onClick={() => {
                      signOut(auth)
                    }}
                    colorScheme='purple'
                    size='sm'
                    variant='outline'
                  >
                    Sign Out
                  </Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </VStack>
      </SlideFade>
    </Box>
  )
}

export default IconControls
