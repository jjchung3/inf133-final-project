const { PubSub  } = require('apollo-server-express')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const pubsub = new PubSub()
const chats = []
const users = []
const CHAT_CHANNEL = 'CHAT_CHANNEL'

const publish = () => {
  setTimeout( () =>
  chats.forEach(msg => pubsub.publish(CHAT_CHANNEL, {msg})), 1000)
}

const resolvers = {
  Query: {
    me (_root, _args, { req }) {
      try {
        return jwt.decode(req.cookies.token).user
      } catch (err) {
        console.log('no token')
        return null
      }
    },

    chats (_root, _args, _ctx) {
      return chats
    },

    users(_root, _args,_ctx) {
      return users
    }

  },

  Mutation: {

    createUser: async (_root, { username, password }, { res }) => {
      let hashedPass
      try {
        hashedPass = await argon2.hash(password)
      } catch (err) {
        console.log(err.message)
      }
      if (users.findIndex(user => user.username === username) !== -1) {
        console.log('User exists')
        return
      } else {
        const user = { 
          id: users.length,
          username: username,
          password: hashedPass,
        }
        users.push(user)
        const token = jwt.sign({ user: user }, 'inf133secret')
        res.cookie('token', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7, //cookie duration: 1 week\
          httpOnly: true,
        })
        return user
      }
    },

    loginUser: async (_root, {username, password }, { res }) => {
      const foundUser = users.find(user => user.username === username)
      if (foundUser) {
        try {
          if (await argon2.verify(foundUser.password, password)) {
            const token = jwt.sign({ user: foundUser }, 'inf133secret')
            res.cookie('token', token, {
              maxAge: 1000 * 60 * 60 * 24 * 7, //cookie duration: 1 week\
              httpOnly: true,
            })
            return foundUser
          } else {
            console.log('Password does not match')
            return
          }
        } catch (err) {
          console.log(err.message)
        }
      } else {
        console.log('User does not exist')
        return
      }
    },

    logout: async (_root, _args, { res }) => {
      res.clearCookie('token')
      return 'sucess'
    },

    sendMessage (_root, { fromId, from, message }) {
      const chat = { 
        id: chats.length + 1, 
        fromId: fromId,
        from, message 
      }
      chats.push(chat)
      pubsub.publish(CHAT_CHANNEL, { liveMessages: chat })
      return chat
    }
  },

  Subscription: {
    liveMessages: {
      subscribe: () => pubsub.asyncIterator([CHAT_CHANNEL])
    }
  }

}


module.exports = resolvers