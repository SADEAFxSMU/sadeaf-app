const workers = [
  require("workers/example")
]

// Start all worker
workers.forEach(worker => worker.start())

// Start a fastify server for healthcheck
const fastify = require('fastify')({
  logger: true
})

fastify.get('/_healthcheck', (request, reply) => {
  const ok = workers.every((worker) => worker.health())
  reply.code(ok ? 200 : 400).send({ok})
})

fastify.listen(5000, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})
