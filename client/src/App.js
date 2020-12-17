import React, { Component } from 'react'
import { ApolloProvider, useQuery } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import LoginView from './components/LoginView'
import MainView from './components/MainView'

import { ME } from './queries/queries'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/',
  credentials: 'include'
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
})

export const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

/**
 * check if user is already logged in using the ME query
 * checking cookie...
 * return to login if not
 */
const InnerApp = props => {
  const { data, loading, error } = useQuery(ME)
  if (loading) return <></>
  if (error) return <></>
  if (data.me) {
    return (
      <Redirect 
        push 
        to={{
          pathname: '/main',
          state: { data: data.me }
        }}
      />
    )
  } else {
    return <Redirect push to={'/login'} />
  }
}

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Route component={InnerApp} />
          <Route path='/main' component={MainView}></Route>
          <Route path='/login' component={LoginView}></Route>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default App
