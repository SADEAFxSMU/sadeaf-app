import pubsub from '../pubsub';
import { TELEGRAM } from '../../config';
import fetch from 'node-fetch';

module.exports = async function () {
  const { subscribe } = await pubsub();

  await subscribe('telegram-sender', async ({ data: { message, chatId } }) => {
    const url = `${TELEGRAM.BASE_URL}/sendMessage`;

    await new Promise(async (resolve, reject) => {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
      let responseBody = await response.json();

      if (responseBody.ok) {
        resolve();
      } else {
        console.error(responseBody);
        reject();
      }
    });
  });
};
