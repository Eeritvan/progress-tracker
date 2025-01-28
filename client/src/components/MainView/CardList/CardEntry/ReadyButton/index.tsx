import { Check } from 'lucide-react'
import useCardListSlice from '@/store/cardListStore'
import { COLORS } from '@/utils/constants'
import { completeDayMutation } from '@/graphql/mutations'
import { useMutation } from '@tanstack/react-query'

const ReadyButton = ({ id, completed, color }:
  { id: number, completed: boolean, color: (typeof COLORS)[number] }
) => {
  const toggleDay = useCardListSlice((state) => state.toggleDay)

  const completeDayMutate = useMutation({
    mutationFn: async (id: number) => {
      const result = await completeDayMutation.send({ id })
      if (result.errors) throw result.errors[0].message
      return result.data?.completeDay
    },
    onError: (e) => { throw e },
    onSuccess: () => toggleDay(id)
  })

  return (
    <button
      className={`flex items-center justify-center h-14 rounded-xl
        aspect-square ${completed ? '': 'opacity-40 '}`}
      style={{ backgroundColor: color }}
      onClick={() => completeDayMutate.mutateAsync(id)}
    >
      <Check />
    </button>
  )
}

export default ReadyButton
