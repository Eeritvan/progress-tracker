import CardList from './components/CardList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useQuery } from '@tanstack/react-query'
import TopBar from './components/TopBar'

const App = () => {
  const { getItem } = useLocalStorage('theme')
  const selectedTheme = getItem()

  useQuery({
    queryKey: ['theme', selectedTheme],
    queryFn: () => {
      const theme = selectedTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark' : 'light' : selectedTheme
      document.documentElement.setAttribute('data-theme', theme)
      return theme
    }
  })

  return (
    <div className='flex flex-col items-center bg-background min-h-screen'>
      <div className='container w-[600px]'>
        <TopBar />
        <CardList />
      </div>
    </div>
  )
}

export default App
