import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useQueryClient } from '@tanstack/react-query'
import useCardListSlice from '@/store/cardListStore'
import useSkipSlice from '@/store/skippedAuthStore'

const LogOut = () => {
  const queryClient = useQueryClient()
  const { removeItem } = useLocalStorage('user-info')
  const resetStore = useCardListSlice((state) => state.resetCards)
  const skipped = useSkipSlice((state) => state.skipped)
  const resetSkip = useSkipSlice((state) => state.resetSkip)

  const handleLogout = () => {
    const answer = confirm('are you sure?')
    if (skipped && answer) {
      resetStore()
      resetSkip()
    } else if (answer) {
      removeItem()
      resetStore()
      queryClient.invalidateQueries({ queryKey: ['token'] })
    }
  }

  return (
    <button onClick={() => handleLogout()}>
      logout
    </button>
  )
}

export default LogOut
