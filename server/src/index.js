const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const http = require('http')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

/**
 * 
 * Secret should be inside of a env file
 * However, because this is a public project, the secret will be revealed
 * Secret: inf133secret
 * 
 */

const corsOptions = {
  origin: 'http://localhost:3000', //change to production later...
  credentials: true,
}

const app = express()


app.use(cors(corsOptions))
app.use(cookieParser())
app.use((req, _res, next) => {
  const { token } = req.cookies
  if (token) {
    const id = jwt.verify(token, 'inf133secret').userId
    req.userId = id
  }
  next()
})

const server = new ApolloServer({ 
  typeDefs: typeDefs, 
  resolvers: resolvers,
  context: ({ req, res }) => ({ req, res }),
})

server.applyMiddleware({
  app: app,
  path: '/',
  cors: false,
})

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port: 4000 }, () => {
  console.log(`server started at http://localhost:4000${server.graphqlPath}`)
  console.log(`subscription server started at ws://localhost:4000${server.subscriptionsPath}`)
})
