import Button from './Button'
import FormField from './FormField'
import ColorSelector from './ColorSelector'
import { SubmitHandler, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import useCardsSlice, { Card } from '../../../store/cardListStore'
import {
  object,
  pipe,
  string,
  minLength,
  picklist,
  InferInput
} from 'valibot'
import { useState } from 'react'

const colors = ['blue', 'red', 'green'] as const

const newCardSchema = object({
  title: pipe(
    string('title is required'),
    minLength(3, 'Needs to be at least 3 characters')
  ),
  desc: pipe(
    string('description is required')
  ),
  color: pipe(
    picklist(colors, 'Please select your color.')
  )
})

type CardData = InferInput<typeof newCardSchema>

const NewCardform = () => {
  const addNewCard = useCardsSlice((state) => state.addNewCard)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CardData>({
    resolver: valibotResolver(newCardSchema)
  })

  const [id, setId] = useState(0)

  const onSubmit: SubmitHandler<CardData> = async (data) => {
    try {
      const newCard: Card = {
        id,
        name: data.title,
        desc: data.desc,
        completedDays: [],
        color: data.color,
        icon: undefined
      }
      setId(id + 1)
      addNewCard(newCard)
    } catch (error) {
      setError('root', { message: error as unknown as string })
    }
  }

  return (
    <form
      className='w-[600px] bg-gray-300 rounded-xl p-2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        type = 'text'
        error = {errors.title?.message}
        register = {register}
        name = 'title'
        placeholder = 'title'
      />
      <FormField
        type = 'text'
        error = {errors.desc?.message}
        register = {register}
        name = 'desc'
        placeholder = 'description'
      />
      <ColorSelector
        register={register}
        error={errors.color?.message}
      />
      <Button
        isSubmitting={isSubmitting}
        error={errors.root?.message}
      />
    </form>
  )
}

export default NewCardform
