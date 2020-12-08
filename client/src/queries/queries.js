import gql from 'graphql-tag'

export const ME = gql`
  query me {
    me {
      id
      username
    }
  }
`

export const CHATS = gql`
  query chats {
    chats {
      id
      fromId
      from
      message
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
      username
    }
  }
`

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`

export const SIGNUP = gql`
  mutation signup($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
      username
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation send($fromId: Int!, $from: String!, $message: String!) {
    sendMessage(fromId: $fromId, from: $from, message: $message) {
      id
    }
  }
`

export const CHAT_SUBSCRIPTION = gql`
  subscription liveChat {
    liveMessages {
      id
      from
      fromId
      message
    }
  }
`