import pubsub from "../pubsub";
// noinspection ES6PreferShortImport
import { SMTP } from "../../config";
import { SMTPClient } from "emailjs";

const client = new SMTPClient({
  user: SMTP.USERNAME,
  password: SMTP.PASSWORD,
  host: SMTP.HOST,
  port: SMTP.PORT,
  tls: SMTP.TLS,
});

module.exports = async function () {
  const { subscribe } = await pubsub();

  await subscribe("email-example", async ({ data: { from, to, subject, body } }) => {
    // TODO(sde): Refer to this https://github.com/eleith/emailjs
    const msg = {
      from: from,
      to: to,
      subject: subject,
      text: body,
    };

    await new Promise((resolve, reject) => {
      client.send(msg, (err, message) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};
