const AWS = require('aws-sdk')
const config = require("../config")

const sqs = getSqs()

function getSqs() {
  if (config.AWS.SQS.ENDPOINT || config.PRODUCTION) {
    AWS.config.update({region: config.AWS.REGION})
    AWS.config.accessKeyId = config.AWS.ACCESS_KEY_ID
    AWS.config.secretAccessKey = config.AWS.SECRET_ACCESS_KEY

    return new AWS.SQS({
      apiVersion: '2012-11-05',
      endpoint: config.AWS.SQS.ENDPOINT
    })
  }

  return new AWS.SQS({apiVersion: '2012-11-05'})
}

class Queue {
  constructor(queueUrl) {
    this.queueUrl = queueUrl
  }

  getMessages() {
    const params = {
      MaxNumberOfMessages: 10,
      QueueUrl: this.queueUrl,
      VisibilityTimeout: 60,
      WaitTimeSeconds: 3
    }

    return new Promise((resolve, reject) => {
      sqs.receiveMessage(params, (err, data) => {
        if (err) {
          reject(err)
        } else if (data.Messages) {
          resolve(data.Messages)
        } else {
          resolve([])
        }
      })
    })
  }

  /**
   * @param body as string
   * @return {Promise}
   */
  sendMessage(body) {
    const params = {
      MessageBody: body,
      QueueUrl: this.queueUrl
    }

    return new Promise((resolve, reject) => {
      sqs.sendMessage(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  deleteMessage(message) {
    const deleteParams = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }

    return new Promise((resolve, reject) => {
      sqs.deleteMessage(deleteParams, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

module.exports = {

  list() {
    return new Promise((resolve, reject) => {
      sqs.listQueues(function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },

  /**
   * @param queueName
   * @param options option
   * @return {Promise<Queue>}
   */
  createQueue(queueName, options) {
    const params = Object.assign({
      QueueName: queueName,
      Attributes: {
        DelaySeconds: "0"
      }
    }, options)

    return new Promise((resolve, reject) => {
      sqs.createQueue(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(new Queue(data.QueueUrl))
        }
      })
    })
  },

  /**
   * @param queueName
   * @return {Promise}
   */
  deleteQueue(queueName) {
    return new Promise((resolve, reject) => {
      sqs.getQueueUrl({QueueName: queueName}, function (err, data) {
        if (err) {
          reject(err)
        } else {
          sqs.deleteQueue({QueueUrl: data.QueueUrl}, function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        }
      })

    })
  },

  /**
   * @param queueName
   * @return {Promise<Queue>}
   */
  getQueue(queueName) {
    return new Promise((resolve, reject) => {
      sqs.getQueueUrl({QueueName: queueName}, function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(new Queue(data.QueueUrl))
        }
      })
    })
  },
}
