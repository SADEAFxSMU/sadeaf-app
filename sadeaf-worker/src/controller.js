const {getQueue: sqsGetQueue} = require('./queue')

class Controller {
  constructor(workers) {
    this.workers = workers
    this.queues = {}
  }

  start(fastify) {
    this.workers.forEach(worker => worker.start())

    fastify.get('/_healthcheck', (request, reply) => {
      const ok = this.workers.every((worker) => worker.health())
      reply.code(ok ? 200 : 400).send({ok})
    })

    fastify.post('/hasura/webhook/:queue', (request, reply) => {
      const queueName = request.params.queue
      const json = JSON.stringify(request.body)

      this.getQueue(queueName)
        .then(async (q) => {
          await q.sendMessage(json)
        })
        .then(() => reply.code(200).send({}))
        .catch((err) => reply.send(err))
    })
  }

  /**
   *
   * @param queueName
   * @return {Promise<Queue>}
   */
  async getQueue(queueName) {
    if (!this.queues[queueName]) {
      this.queues[queueName] = await sqsGetQueue(queueName)
    }

    return this.queues[queueName]
  }

  stop() {
    this.workers.forEach(worker => worker.stop())
  }
}

module.exports = function (workers) {
  return new Controller(workers)
}
