import fetch from 'node-fetch';
import { TELEGRAM } from '../config';

export async function sendTelegramMessage(message, chatId) {
  const url = `${TELEGRAM.BASE_URL}/sendMessage`;

  console.log(message);

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

  if (!responseBody.ok) {
    console.error(responseBody);
    throw 'Error in sending telegram message';
  }
}
