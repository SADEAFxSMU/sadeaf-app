import pubsub from '../../pubsub';
// noinspection ES6PreferShortImport
import { SMTP } from '../../../config';
import { SMTPClient } from 'emailjs';

const client = new SMTPClient({
  user: SMTP.USERNAME,
  password: SMTP.PASSWORD,
  host: SMTP.HOST,
  port: SMTP.PORT,
  tls: SMTP.TLS,
});

module.exports = async function () {
  const { subscribe } = await pubsub();

  // body should be a HTML string representing the email
  await subscribe('email-sender', async ({ data: { from, to, subject, body } }) => {
    const msg = {
      from: from,
      to: to,
      subject: subject,
      attachment: [{ data: body, alternative: true }],
    };

    await new Promise((resolve, reject) => {
      client.send(msg, (err, message) => {
        if (err) {
          console.error(`[EmailExample] ${err}`);
          reject(err);
        } else resolve();
      });
    });
  });
};
