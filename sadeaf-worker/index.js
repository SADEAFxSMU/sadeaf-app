const Controller = require('./src/controller')
const fastify = require('fastify')({
  logger: true
})

Controller(fastify, [
  require("./src/workers/email-example")
]).start()

fastify.listen(5000, (err, address) => {
  if (err) throw err
  this.fastify.log.info(`server listening on ${address}`)
})
