import React from 'react'
import { Route, Switch } from 'react-router-dom'
import LoginView from '../components/LoginView'

const AppRouter = () => {
  <Switch>
    <Route path='/login' component={LoginView}></Route>
  </Switch>
}

export default AppRouter