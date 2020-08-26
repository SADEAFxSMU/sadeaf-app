const {Worker} = require('./abstract')
const {SMTPClient} = require('emailjs')

const client = new SMTPClient({
  user: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  host: process.env.SMTP_HOST || "localhost",
  port: process.env.SMTP_PORT || 21025,
  ssl: process.env.SMTP_SSL === "true",
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
