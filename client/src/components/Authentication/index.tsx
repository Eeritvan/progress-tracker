import { Link, Route, Switch } from 'wouter'
import Selector from './Selector'
import Login from './Login'
import Register from './Register'

const Authentication = () => {
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
    </>
  )
}

export default Authentication
