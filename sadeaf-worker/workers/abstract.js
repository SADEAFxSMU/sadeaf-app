const pino = require('pino')()
const AWS = require('aws-sdk')
// TODO(fuxing): Region
AWS.config.update({region: 'REGION'})

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

class Worker {

  /**
   * Create worker with the name and queryUrl, you can create multiple worker.
   * @param name of the worker for logging purpose
   * @param queueUrl of the SQS queue to read from.
   */
  constructor(name, queueUrl, options) {
    this.name = name
    this.queueUrl = queueUrl
    this.options = options

    this.logger = pino.child({worker: name})
    this.lastAlive = Date.now()
  }

  start() {
    const params = {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: this.queueUrl,
      VisibilityTimeout: 10,
      WaitTimeSeconds: 3
    }

    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        this.logger.error(err)
        return
      }

      for (const message of data.Messages) {
        this.options.onReceiveMessage(message)
        this.deleteMessage(message)
      }

      this.lastAlive = Date.now()
    })
  }

  /**
   * @param message to delete, after handling it
   */
  deleteMessage(message) {
    const deleteParams = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }

    sqs.deleteMessage(deleteParams, (err, data) => {
      if (err) {
        this.logger.error(err)
      }
    })
  }

  /**
   * @return {boolean} whether last alive is 60 seconds since now
   */
  health() {
    return this.lastAlive + 60_000 > Date.now()
  }
}

module.exports = {
  Worker
}
