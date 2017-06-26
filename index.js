const Hapi = require('hapi')
const server = new Hapi.Server()
const routes = require('./routes')
const mongoose = require('mongoose')
const mongoUri = process.env.MONGO_HOST || 'mongodb://localhost/shortio'
const inert = require('inert')

const options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 3000
    }
  }
}

mongoose.connect(mongoUri, options)

const db = mongoose.connection

server.connection({
  port: process.env.PORT || 3000,
  routes: { cors: true }
})

server.register(inert, (err) => {
  db.on('error', console.error.bind(console, 'connection error: '))
    .once('open', () => {
      server.route(routes)

      server.start((err) => {
        if (err) throw err

        console.log(`Server running on port ${server.info.port}`)
      })
    })
})
