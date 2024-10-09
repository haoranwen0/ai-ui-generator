import React, { useState, useEffect } from 'react'
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
  SlideFade,
  Flex,
  Icon,
  useToast
} from '@chakra-ui/react'
import {
  FaSun,
  FaMoon,
  FaCode,
  FaEye,
  FaCog,
  FaSignOutAlt,
  FaComments,
  FaCoins,
  FaStar,
  FaCommentAlt
} from 'react-icons/fa'

import { setView } from '../../../redux/features/viewToggle/viewToggleSlice'
import {
  signOut,
  onAuthStateChanged,
  getAuth,
  User,
  getIdToken
} from 'firebase/auth'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { setCount } from '../../../redux/features/counter/counterSlice'
import axios from 'axios'
import { get } from '../../../utils/api'

const IconControls = () => {
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const auth = getAuth()

  const counter = useAppSelector((state) => state.counter.value)

  const { colorMode, toggleColorMode } = useColorMode()
  // const [usageRemaining, setUsageRemaining] = useState(15)

  useEffect(() => {
    if (auth.currentUser) {
      console.log('Fetching usage')
      fetchUsage(auth.currentUser)
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('Fetching usage')
        fetchUsage(currentUser)
      } else {
        // console.log('No user signed in')
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchUsage = async (currentUser: User) => {
    try {
      console.log('Fetching usage')
      const idToken = await getIdToken(currentUser)
      const response = await get<{ count: number }>(`/usage`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
      console.log(response.data.count)
      dispatch(setCount(response.data.count))
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error fetching projects',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      // console.error('Error fetching projects:', err)
    }
  }

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
    {
      name: 'Feedback Forum',
      icon: FaCommentAlt,
      onClick: () => {
        window.open(
          'https://qualtricsxmpsybmcsgf.qualtrics.com/jfe/form/SV_37xNYk8iToBrS5M',
          '_blank',
          'noopener,noreferrer'
        )
      }
    }
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
        <VStack borderRadius='md' boxShadow='md' alignItems='flex-start'>
          {icons.map((item) => (
            <Tooltip
              key={item.name}
              label={item.name}
              placement='right'
              hasArrow
            >
              <IconButton
                aria-label={item.name}
                icon={<item.icon color='#B794F4' opacity={0.8} />}
                variant='outline'
                color={iconColor[colorMode]}
                _hover={{ bg: 'purple.700', color: 'purple.600', opacity: 0.8 }}
                _active={{
                  bg: 'purple.700',
                  color: 'purple.700',
                  opacity: 0.8
                }}
                onClick={item.onClick}
                transition='all 0.2s'
              />
            </Tooltip>
          ))}
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
                    <Flex alignItems='center'>
                      <Text fontWeight='bold' fontSize='sm' mr={2}>
                        Credits Remaining
                      </Text>
                    </Flex>
                    <Text fontSize='sm'>{counter} credits</Text>
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
