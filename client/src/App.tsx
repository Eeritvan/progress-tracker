import Settings from './components/Settings'
import AddNew from './components/AddNew'
import CardList from './components/CardList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const { getItem } = useLocalStorage('theme')
  const selectedTheme = getItem()

  useQuery({
    queryKey: ['theme', selectedTheme],
    queryFn: () => {
      if (selectedTheme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.setAttribute('data-theme', 'light')
        }
      } else {
        document.documentElement.setAttribute('data-theme', selectedTheme)
      }
      return selectedTheme
    }
  })

  return (
    <div className='flex flex-col items-center bg-background min-h-screen'>
      <Settings />
      <AddNew />
      <CardList/>
    </div>
  )
}

export default App
