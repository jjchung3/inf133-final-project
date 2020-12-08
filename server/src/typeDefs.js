const typeDefs = `
  type User {
    id: Int!
    username: String!
    password: String!
  }

  type Chat {
    id: Int!
    fromId: Int!
    from: String!
    message: String!
  }

  type Query {
    me: User
    chats: [Chat]
    users: [User]
  }

  type Mutation {
    createUser(username: String!, password: String!): User
    loginUser(username: String!, password: String!): User
    sendMessage(
      fromId: Int!,
      from: String!, 
      message: String!
    ): Chat
    logout: String!
  }

  type Subscription {
    liveMessages: Chat
  }
`

module.exports = typeDefs