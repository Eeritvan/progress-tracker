import CardList from './components/CardList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useQuery } from '@tanstack/react-query'
import TopBar from './components/TopBar'
import { Redirect, Route, Switch } from 'wouter'
import Authentication from './components/Authentication'

const App = () => {
  const { setItem: setTheme, getItem: getTheme } = useLocalStorage('theme')
  const { getItem: getUser } = useLocalStorage('user-info')
  const selectedTheme = getTheme()

  useQuery({
    queryKey: ['theme', selectedTheme],
    queryFn: () => {
      if (!selectedTheme)
        setTheme('system')
      const theme = selectedTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark' : 'light' : selectedTheme
      document.documentElement.setAttribute('data-theme', theme)
      return theme
    }
  })

  const { data: token } = useQuery({
    queryKey: ['token'],
    refetchOnWindowFocus: false,
    queryFn: () => getUser()
  })

  return (
    <div
      className='flex flex-col items-center bg-background min-h-screen'
    >
      <Switch>
        <Route path='/login'>
          {token ? <Redirect to='/' /> : <Authentication />}
        </Route>
        <Route path='/register'>
          {token ? <Redirect to='/' /> : <Authentication />}
        </Route>
        <Route>
          {!token ? <Redirect to='/login' /> :
            <div className='container w-[600px]'>
              <TopBar />
              <CardList />
            </div>
          }
        </Route>
      </Switch>
    </div>
  )
}

export default App
