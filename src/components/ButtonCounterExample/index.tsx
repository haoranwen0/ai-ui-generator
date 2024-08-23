import { Button, Text } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { decrement, increment } from '../../redux/features/counter/counterSlice'

const ButtonCounterExample = () => {
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
