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
  Button
} from '@chakra-ui/react'
import {
  FaSun,
  FaMoon,
  FaCode,
  FaEye,
  FaCog,
  FaSignOutAlt,
  FaMagic,
  FaRobot,
  FaComments
} from 'react-icons/fa'

import { useAppDispatch } from '../../../redux/hooks'
import { setView } from '../../../redux/features/viewToggle/viewToggleSlice'

const IconControls = () => {
  const dispatch = useAppDispatch()

  const { colorMode, toggleColorMode } = useColorMode()
  const [isVisible, setIsVisible] = useState(true)
  const [usageRemaining, setUsageRemaining] = useState(15)

  const iconColor = { light: 'purple.400', dark: 'purple.200' }
  const bgColor = { light: 'purple.50', dark: 'purple.900' }

  const icons = [
    {
      name: 'Code Editor',
      icon: FaCode,
      onClick: () => dispatch(setView('Code'))
    },
    {
      name: 'Preview',
      icon: FaEye,
      onClick: () => dispatch(setView('Preview'))
    },
    {
      name: 'Chat',
      icon: FaComments,
      onClick: () => {
        console.log('Chat button clicked')
        // TODO: Implement chat toggle functionality
      }
    }
  ]

  return (
    <Box
      position='absolute'
      bottom='4'
      left='4'
      zIndex={1000}
      // onMouseEnter={() => setIsVisible(true)}
      // onMouseLeave={() => setIsVisible(false)}
    >
      <Box
        position='absolute'
        bottom='0'
        left='0'
        width='200px'
        height='200px'
        opacity={0}
      />
      <VStack
        spacing={1}
        bg={bgColor[colorMode]}
        borderRadius='md'
        p={1}
        boxShadow='md'
        opacity={isVisible ? 1 : 0}
        transform={`translateY(${isVisible ? 0 : 10}px)`}
        transition='all 0.3s ease-in-out'
      >
        {icons.map((item) => (
          <Tooltip key={item.name} label={item.name} placement='right' hasArrow>
            <IconButton
              aria-label={item.name}
              icon={<item.icon />}
              variant='ghost'
              color={iconColor[colorMode]}
              _hover={{ bg: 'purple.100', color: 'purple.600' }}
              _active={{ bg: 'purple.200', color: 'purple.700' }}
              onClick={item.onClick}
              transition='all 0.2s'
            />
          </Tooltip>
        ))}
        <Popover placement='right-start'>
          <PopoverTrigger>
            <IconButton
              aria-label='Settings'
              icon={<FaCog />}
              variant='ghost'
              color={iconColor[colorMode]}
              _hover={{ bg: 'purple.100', color: 'purple.600' }}
              _active={{ bg: 'purple.200', color: 'purple.700' }}
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
                <Box>
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
                </Box>
                <Button
                  leftIcon={<FaSignOutAlt />}
                  // onClick={onSignOut}
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
    </Box>
  )
}

export default IconControls
