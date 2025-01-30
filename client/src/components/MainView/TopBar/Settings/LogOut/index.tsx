import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useQueryClient } from '@tanstack/react-query'
import useCardListSlice from '@/store/cardListStore'

const LogOut = () => {
  const queryClient = useQueryClient()
  const { removeItem } = useLocalStorage('user-info')
  const resetStore = useCardListSlice((state) => state.resetCards)

  const handleLogout = () => {
    const answer = confirm('are you sure?')
    if (answer) {
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
