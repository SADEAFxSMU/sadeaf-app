const {test} = require('tap')
const Fastify = require('fastify')

const Controller = require("../src/controller")
const {createQueue, deleteQueue} = require('../src/queue')
const {Worker} = require("../src/workers/abstract")
const {sleep} = require("./helper")

async function setup(t, onReceiveMessage) {
  const queueName = "WebHookQueue"
  await createQueue(queueName)

  const controller = Controller([
    new Worker(queueName, {
      cycleTime: 1000,
      dieAfter: 1,
      onReceiveMessage,
    })
  ])

  const fastify = Fastify()
  controller.start(fastify)

  t.tearDown(fastify.close.bind(fastify))
  t.tearDown(() => controller.stop())
  t.tearDown(async () => {
    await sleep(1000)
    await deleteQueue(queueName)
  })

  return fastify
}

test('/hasura/webhook/WebHookQueue', (t) => {
  t.plan(2)
  t.setTimeout(6000)

  setup(t, (payload, done) => {
    done()
    t.equal(payload.id, "123")
    t.equal(payload.string, "Okay")
  }).then((fastify) => {
    fastify.inject({
      url: '/hasura/webhook/WebHookQueue',
      method: "POST",
      payload: {
        id: "123",
        string: "Okay"
      }
    })
  })
})
