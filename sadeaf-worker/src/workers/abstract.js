const pino = require('pino')()
const {getQueue} = require('../queue')

const OPTIONS_DEFAULT = {
  /**
   * How many milliseconds does it wait to call receiveMessage before the last empty message request.
   */
  cycleTime: 30_000,
  /**
   * How many cycle does it wait before it die if any exceptions occured.
   */
  dieAfter: 2
}

class Worker {

  /**
   * Create worker with the name and queryUrl, you can create multiple worker.
   * @param {string} name of the SQS Queue.
   * @param {{cycleTime: number, dieAfter: number, onReceiveMessage: function(Object, Function, {})}} options of the worker.
   */
  constructor(name, options) {
    this.queueName = name
    this.options = Object.assign(OPTIONS_DEFAULT, options)

    this.logger = pino.child({worker: name})
    this.lastAlive = Date.now()
  }

  /**
   * Start the worker and listen for messages to process
   */
  async start() {
    this.queue = await getQueue(this.queueName)
      .catch((err) => this.logger.error(err))
    this.listening = true
    this.listen()
  }

  listen() {
    if (!this.listening) {
      return
    }

    this.queue.getMessages()
      .then((messages) => {
        this.lastAlive = Date.now()

        for (const message of messages) {
          this.options.onReceiveMessage.call(this, JSON.parse(message.Body), () => {
            return this.queue.deleteMessage(message)
              .catch((err) => this.logger.error(err))
          }, message.Attributes)
        }

        return messages.length > 0
      })
      .then((hasAny) => {
        if (hasAny) {
          setTimeout(this.listen, 1000)
        } else {
          setTimeout(this.listen, this.options.cycleTime)
        }
      })
      .catch((err) => {
        this.logger.error(err)
        setTimeout(this.listen, this.options.cycleTime)
      })
  }

  stop() {
    this.listening = false
  }

  /**
   * @return {boolean} whether worker is still alive
   */
  health() {
    return this.lastAlive + (this.options.cycleTime * this.options.dieAfter) > Date.now()
  }
}

module.exports = {
  Worker
}
