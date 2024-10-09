import React from 'react'
import {
  Box,
  VStack,
  Text,
  Radio,
  RadioGroup,
  Input,
  Button,
  useColorModeValue,
  CheckboxGroup,
  Checkbox
} from '@chakra-ui/react'
import { FaQuestionCircle } from 'react-icons/fa'
import {
  addMessage,
  setIsLoading
} from '../../../redux/features/chat/chatSlice'
import { useDispatch, useSelector } from 'react-redux'
import { callAIUIGenerator } from '../../../functions/utils'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { Message } from '../Chat'
import { setCode } from '../../../redux/features/codeEditor/codeEditorSlice'
import { decrement } from '../../../redux/features/counter/counterSlice'

// Define the interfaces
interface Option {
  value: string
  label: string
}

export interface Question {
  id: number
  text: string
  type: 'multiple_choice' | 'text' | 'multi_select'
  options?: string[]
}

interface QuestionProps {
  question: Question
  onAnswer: (id: number, answer: string) => void
}

// Create a component for rendering a single question
const QuestionComponent: React.FC<QuestionProps> = ({ question, onAnswer }) => {
  const [value, setValue] = React.useState('')

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onAnswer(question.id, newValue)
  }

  // Theme-aware colors
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('purple.700', 'purple.100')
  const borderColor = useColorModeValue('purple.200', 'purple.700')
  const hoverBorderColor = useColorModeValue('purple.300', 'purple.600')
  const focusBorderColor = useColorModeValue('purple.400', 'purple.500')
  const focusBoxShadow = useColorModeValue(
    '0 0 0 1px #D6BCFA',
    '0 0 0 1px #6B46C1'
  )

  return (
    <Box
      borderWidth='1px'
      borderRadius='lg'
      p={4}
      bg={bgColor}
      borderColor={borderColor}
      boxShadow='sm'
    >
      <VStack align='start' spacing={4}>
        <Text fontWeight='bold' fontSize='lg' color={textColor}>
          <FaQuestionCircle style={{ display: 'inline', marginRight: '8px' }} />
          {question.text}
        </Text>

        {question.type === 'multiple_choice' && question.options && (
          <RadioGroup onChange={handleChange} value={value}>
            <VStack align='start' spacing={2}>
              {question.options.map((option, index) => (
                <Radio key={index} value={option} colorScheme='purple'>
                  {option}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        )}
        {question.type === 'multi_select' && question.options && (
          <CheckboxGroup
            onChange={(values) => handleChange(values.join(','))}
            value={value.split(',')}
          >
            <VStack align='start' spacing={2}>
              {question.options.map((option, index) => (
                <Checkbox key={index} value={option} colorScheme='purple'>
                  {option}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        )}
        {question.type === 'text' && (
          <Input
            placeholder='Type your answer here'
            onChange={(e) => handleChange(e.target.value)}
            value={value}
            borderColor={borderColor}
            _hover={{ borderColor: hoverBorderColor }}
            _focus={{
              borderColor: focusBorderColor,
              boxShadow: focusBoxShadow
            }}
          />
        )}
      </VStack>
    </Box>
  )
}

// Create a component for rendering all questions
interface QuestionsContainerProps {
  questions: Question[]
}

const QuestionsContainer: React.FC<QuestionsContainerProps> = ({
  questions
}) => {
  const [answers, setAnswers] = React.useState<Record<number, string>>({})
  const dispatch = useAppDispatch()
  const messages = useAppSelector((store) => store.chat.value)
  const user = useAppSelector((store) => store.user.user)

  const handleAnswer = (id: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }))
  }

  const handleSubmit = async () => {
    if (user === null) {
      return
    }

    const newMessage: Message = {
      content: JSON.stringify(answers),
      role: 'user'
    }
    dispatch(addMessage(newMessage))
    dispatch(setIsLoading(true))
    try {
      const data = await callAIUIGenerator(
        [...messages, newMessage],
        await user.getIdToken()
      )
      dispatch(addMessage({ content: JSON.stringify(data), role: 'assistant' }))

      if (data.code) {
        dispatch(setCode(data.code))
      }
      dispatch(decrement())
    } catch (error) {
      console.log('Error submitting message', error)
    } finally {
      dispatch(setIsLoading(false))
    }
  }

  // Theme-aware colors for the submit button
  const buttonColorScheme = useColorModeValue('purple', 'purple')

  return (
    <VStack
      spacing={2}
      align='stretch'
      width='100%'
      maxWidth='600px'
      margin='auto'
    >
      {questions.map((question) => (
        <QuestionComponent
          key={question.id}
          question={question}
          onAnswer={handleAnswer}
        />
      ))}
      <Button
        colorScheme={buttonColorScheme}
        onClick={handleSubmit}
        alignSelf='flex-end'
        mt={4}
      >
        Submit
      </Button>
    </VStack>
  )
}

export default QuestionsContainer
