import React from 'react'

import { Button, Text } from '@chakra-ui/react'

import { decrement, increment } from '../../redux/features/counter/counterSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

const ButtonCounterExample: React.FC = () => {
  const dispatch = useAppDispatch()

  const counter = useAppSelector((store) => store.counter.value)

  return (
    <div>
      <Text>{counter}</Text>
      <Button onClick={() => dispatch(increment())}>Increment</Button>
      <Button onClick={() => dispatch(decrement())}>Decrement</Button>
    </div>
  )
}

export default ButtonCounterExample
