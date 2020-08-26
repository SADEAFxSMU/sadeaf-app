const config = require('../../config')
const {test} = require('tap')
const {createQueue, deleteQueue} = require('../../src/queue')

const {sleep} = require("../helper")
const emailWorker = require("../../src/workers/email-example")

const axios = require('axios').default

test('email receive', async (t) => {
  t.setTimeout(10000)
  await createQueue(emailWorker.queueName)
  await emailWorker.start()
  emailWorker.options.cycle = 1000

  t.tearDown(() => emailWorker.stop())
  t.tearDown(async () => await deleteQueue(emailWorker.queueName))

  const body = {
    from: 'sadeaf.from@fuxing.io',
    to: Math.random() + '.sadeaf.to@fuxing.io',
    subject: 'TITLE',
    body: 'BODY',
  }
  await emailWorker.queue.sendMessage(JSON.stringify(body))
  await sleep(emailWorker.options.cycle * 2)

  const total = await axios.get(`${config.MAILHOG.ENDPOINT}/api/v2/search`, {
    params: {kind: "to", query: body.to}
  }).then(({data}) => {
    return data?.total
  })
  t.equal(total, 1)
})
