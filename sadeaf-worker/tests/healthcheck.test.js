const {test} = require('tap')
const Fastify = require('fastify')

const Controller = require("../src/controller")
const {createQueue, deleteQueue} = require('../src/queue')
const {Worker} = require("../src/workers/abstract")
const {sleep} = require("./helper")

test('/_healthcheck should success', async (t) => {
  t.setTimeout(6000)

  const queueName = "HealthcheckSuccess"
  await createQueue(queueName)

  const controller = Controller([
    new Worker(queueName, {
      cycleTime: 1000,
      dieAfter: 1
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

  const res = await fastify.inject({
    url: '/_healthcheck'
  })
  t.deepEqual(JSON.parse(res.payload), {ok: true})
  t.equal(res.statusCode, 200)
  t.end()
})

test('/_healthcheck should fail', async (t) => {
  t.setTimeout(6000)

  const queueName = "HealthcheckFail"
  await createQueue(queueName)

  const controller = Controller([
    new Worker(queueName, {
      cycleTime: 1000,
      dieAfter: 1
    })
  ])

  const fastify = Fastify()
  controller.start(fastify)

  t.tearDown(fastify.close.bind(fastify))
  t.tearDown(() => controller.stop())

  let res = await fastify.inject({url: '/_healthcheck'})
  t.equal(res.statusCode, 200)

  await deleteQueue(queueName)
  await sleep(3000)

  res = await fastify.inject({url: '/_healthcheck'})
  t.equal(res.statusCode, 400)
  t.end()
})
