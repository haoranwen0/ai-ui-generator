import React from 'react'

import {
  Box,
  Button,
  Flex,
  Icon,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import { FaCode, FaEye } from 'react-icons/fa'

import { toggle as toggleView } from '../../../redux/features/viewToggle/viewToggleSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'

const CustomTabList = () => {
  const dispatch = useAppDispatch()

  const selectedTab = useAppSelector((store) => store.viewToggle.view)

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800')
  const boxShadow = useColorModeValue(
    '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 2px 1px -1px rgba(255,255,255,0.2), 0px 1px 1px 0px rgba(255,255,255,0.14), 0px 1px 3px 0px rgba(255,255,255,0.12)'
  )
  const selectedBg = useColorModeValue('purple.50', 'purple.900')
  const selectedColor = useColorModeValue('purple.700', 'purple.200')
  const unselectedColor = useColorModeValue('gray.600', 'gray.400')
  const hoverBg = useColorModeValue('purple.100', 'purple.800')

  return (
    <Box
      bg={bgColor}
      borderRadius='4px'
      boxShadow={boxShadow}
      p='2px'
      width='fit-content'
    >
      <Flex>
        <Tooltip label='Code' placement='top'>
          <Button
            size='sm'
            variant='ghost'
            color={selectedTab === 'Code' ? selectedColor : unselectedColor}
            bg={selectedTab === 'Code' ? selectedBg : 'transparent'}
            _hover={{ bg: hoverBg }}
            onClick={() => dispatch(toggleView())}
            mr='2px'
            fontWeight={selectedTab === 'Code' ? 'medium' : 'normal'}
            borderRadius='4px'
            height='32px'
            minWidth='32px'
            aria-label='Code'
          >
            <Icon as={FaCode} />
          </Button>
        </Tooltip>
        <Tooltip label='Preview' placement='top'>
          <Button
            size='sm'
            variant='ghost'
            color={selectedTab === 'Preview' ? selectedColor : unselectedColor}
            bg={selectedTab === 'Preview' ? selectedBg : 'transparent'}
            _hover={{ bg: hoverBg }}
            onClick={() => dispatch(toggleView())}
            fontWeight={selectedTab === 'Preview' ? 'medium' : 'normal'}
            borderRadius='4px'
            height='32px'
            minWidth='32px'
            aria-label='Preview'
          >
            <Icon as={FaEye} />
          </Button>
        </Tooltip>
      </Flex>
    </Box>
  )
}

export default CustomTabList
