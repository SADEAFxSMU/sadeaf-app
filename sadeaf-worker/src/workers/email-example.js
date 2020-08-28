const {Worker} = require('./abstract')
const config = require("../../config")
const {SMTPClient} = require('emailjs')

const client = new SMTPClient({
  user: config.SMTP.USERNAME,
  password: config.SMTP.PASSWORD,
  host: config.SMTP.HOST,
  port: config.SMTP.PORT,
  tls: config.SMTP.TLS,
})

module.exports = new Worker("EmailExample", {
  // TODO(sde): Refer to this https://github.com/eleith/emailjs
  onReceiveMessage({from, to, subject, body}, done) {
    const msg = {
      from: from,
      to: to,
      subject: subject,
      text: body
    }

    client.send(msg, (err, message) => {
        if (err) {
          this.logger.error(err)
        } else {
          done()
        }
      }
    )
  },
})
