import { Link, Route, Switch } from 'wouter'
import Selector from './Selector'
import Login from './Login'
import Register from './Register'
import useSkipSlice from '@/store/skippedAuthStore'

const Authentication = () => {
  const setSkip = useSkipSlice((state) => state.setSkip)

  return (
    <>
      <Selector>
        <Link to='/login'> Login </Link>
        <Link to='/register'> Register </Link>
      </Selector>
      <Switch>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
      </Switch>

      <br />
      <button
        className="cursor-pointer"
        onClick={() => setSkip()}
      >
        Try the app without logging in!
      </button>
    </>
  )
}

export default Authentication
