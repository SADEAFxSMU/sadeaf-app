const axios = require('axios').default
const queue = require('./src/queue')
const config = require('./config')

const millis = Date.now()
const timeout = 30_000

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop() {
  do {
    if (millis + timeout < Date.now()) {
      throw new Error("Timeout: unable to wait for healthy services")
    }

    const healthy = {}

    await axios.get(`${config.MAILHOG.ENDPOINT}/api/v2/messages`)
      .then(() => {
        healthy.mailhog = true
      })
      .catch(() => {
        healthy.mailhog = false
      })

    await queue.list()
      .then(() => {
        healthy.sqs = true
      })
      .catch(() => {
        healthy.sqs = false
      })

    console.log(`Healthy: ${JSON.stringify(healthy)}`)

    if (healthy.mailhog && healthy.sqs) {
      break
    }

    console.log("Waiting...")
    await sleep(1000)
  } while (true)
}


loop().then(() => {
})
