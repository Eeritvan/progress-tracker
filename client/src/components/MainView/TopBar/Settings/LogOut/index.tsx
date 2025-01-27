import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useQueryClient } from '@tanstack/react-query'

const LogOut = () => {
  const queryClient = useQueryClient()
  const { removeItem } = useLocalStorage('user-info')

  const handleLogout = () => {
    const answer = confirm('are you sure?')
    if (answer) removeItem()
    queryClient.invalidateQueries({ queryKey: ['token'] })
  }

  return (
    <button onClick={() => handleLogout()}>
      logout
    </button>
  )
}

export default LogOut
