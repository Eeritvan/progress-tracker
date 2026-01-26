import { resetAllCardsMutation } from '@/graphql/mutations'
import useCardListSlice from '@/store/cardListStore'
import useSkipSlice from '@/store/skippedAuthStore'
import { useMutation } from '@tanstack/react-query'

const Reset = () => {
  const resetCards = useCardListSlice((state) => state.resetCards)
  const skipped = useSkipSlice((state) => state.skipped)

  const resetAllCardsMutate = useMutation({
    mutationFn: async () => {
      const result = await resetAllCardsMutation.send()
      if (result.errors) throw result.errors[0].message
      return result
    },
    onError: (e) => { throw e },
    onSuccess: () => resetCards()
  })

  const handleClick = async () => {
    const answer = confirm('Are you sure?')
    if (answer && skipped) {
      resetCards()
    } else if (answer) {
      await resetAllCardsMutate.mutateAsync()
    }
  }

  return (
    <div>
      <button onClick={() => handleClick()}>
        Reset everything
      </button>
    </div>
  )
}

export default Reset
