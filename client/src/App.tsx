import { useLocalStorage } from './hooks/useLocalStorage'
import { useQuery } from '@tanstack/react-query'
import { Redirect, Route, Switch } from 'wouter'
import Authentication from './components/Authentication'
import MainView from './components/MainView'
import useSkipSlice from './store/skippedAuthStore'

const App = () => {
  const { setItem: setTheme, getItem: getTheme } = useLocalStorage('theme')
  const { getItem: getUser } = useLocalStorage('user-info')
  const selectedTheme = getTheme()
  const skipped = useSkipSlice((state) => state.skipped)

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
    enabled: !skipped,
    refetchOnWindowFocus: false,
    queryFn: () => getUser()
  })

  return (
    <div
      className='flex flex-col items-center bg-background min-h-screen'
    >
      <Switch>
        <Route path='/login'>
          {(token || skipped) ? <Redirect to='/' /> : <Authentication />}
        </Route>
        <Route path='/register'>
          {(token || skipped) ? <Redirect to='/' /> : <Authentication />}
        </Route>
        <Route>
          {!(token || skipped) ? <Redirect to='/login' /> : <MainView />}
        </Route>
      </Switch>
    </div>
  )
}

export default App
