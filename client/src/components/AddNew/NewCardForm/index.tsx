import { SubmitHandler, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import useCardsSlice, { Card } from '../../../store/cardStore'
import {
  object,
  pipe,
  string,
  optional,
  minLength,
  InferInput
} from 'valibot'
import { useState } from 'react'

const newCardSchema = object({
  title: pipe(
    string('title is required'),
    minLength(3, 'Needs to be at least 3 characters')
  ),
  desc: optional(pipe(
    string('description is required')
  ))
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
        desc: data.desc
      }
      setId(id + 1)
      addNewCard(newCard)
    } catch (error) {
      setError('root', { message: error as unknown as string })
    }
  }

  return (
    <form
      className='w-[600px] bg-red-300 rounded-xl p-2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <input type='text' {...register('title')} placeholder='title' />
      {errors.title && <p>{errors.title?.message}</p>}
      <input type='text' {...register('desc')} placeholder='description' />
      {errors.desc && <p>{errors.desc?.message}</p>}
      <button type='submit' disabled={isSubmitting}>
        submit
      </button>
      {errors.root && <p>{errors.root?.message}</p>}
    </form>
  )
}

export default NewCardform
