class Controller {
  constructor(workers) {
    this.workers = workers
  }

  start(fastify) {
    this.workers.forEach(worker => worker.start())

    fastify.get('/_healthcheck', (request, reply) => {
      const ok = this.workers.every((worker) => worker.health())
      reply.code(ok ? 200 : 400).send({ok})
    })
  }

  stop() {
    this.workers.forEach(worker => worker.stop())
  }
}

module.exports = function (workers) {
  return new Controller(workers)
}
