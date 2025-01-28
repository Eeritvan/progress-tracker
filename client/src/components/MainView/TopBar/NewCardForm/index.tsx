import Button from '@/components/shared/Button'
import FormField from '@/components/shared/FormField'
import ColorSelector from './ColorSelector'
import { SubmitHandler, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import useCardsSlice, { Card } from '@/store/cardListStore'
import {
  object,
  pipe,
  string,
  minLength,
  picklist,
  InferInput,
  optional
} from 'valibot'
import IconSelector from './IconSelector'
import { COLORS, ICONS } from '../../../../utils/constants'
import { createCardMutation } from '@/graphql/mutations'
import { useMutation } from '@tanstack/react-query'

const newCardSchema = object({
  title: pipe(
    string('title is required'),
    minLength(3, 'Needs to be at least 3 characters')
  ),
  desc: optional(pipe(
    string('description is required')
  )),
  color: pipe(
    picklist(COLORS, 'Please select your color.')
  ),
  icon: pipe(
    picklist(ICONS, 'Please select your icon.')
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

  const addCardMutate = useMutation({
    mutationFn: async (data: CardData) => {
      const result = await createCardMutation
        .send({
          name: data.title,
          desc: data.desc || '',
          color: data.color,
          icon: data.icon
        })
      if (result.errors) throw result.errors[0].message
      return result.data?.createCard
    },
    onError: (e) => { throw e },
    onSuccess: (data) => {
      const newCard: Card = {
        id: data.id,
        name: data.name,
        desc: data.desc,
        completedDays: new Set<string>(data.completedDays),
        color: data.color,
        icon: data.icon
      }
      addNewCard(newCard)
    }
  })

  const onSubmit: SubmitHandler<CardData> = async (data) => {
    try {
      await addCardMutate.mutateAsync(data)
    } catch (error) {
      setError('root', { message: error as string })
    }
  }

  return (
    <form
      className='bg-cardbg rounded-xl p-2'
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
      <IconSelector
        register={register}
        error={errors.icon?.message}
      />
      <Button
        isSubmitting={isSubmitting}
        error={errors.root?.message}
      />
    </form>
  )
}

export default NewCardform
