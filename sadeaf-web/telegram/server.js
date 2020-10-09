import express from 'express';
import bodyParser from 'body-parser';
import { PRODUCTION } from '../config';
import { INVALID_MESSAGE } from './registration-messages';
import { getRegisterMessage, getStartMessage } from './actions';

const {
  TELEGRAM: { WEBHOOK_URL },
} = require('../config');

export default {
  async start(port) {
    const app = express();
    app.use(bodyParser.json());

    app.post('/_telegram/webhook', async function (req, res) {
      const chatId = req.body.message.chat.id;
      let { text } = req.body.message;
      const responseBody = {
        method: 'sendMessage',
        chat_id: chatId,
        parse_mode: 'MarkdownV2',
      };
      // do stuff with the 3 variables above
      /*
        1. Check the action based on text
          /start -> send start message, with instructions on how to register
          /register {email} -> email should be the email used to sign up. Check if email exists
                                and if there is telegram info for this email. If there isn't, save chat_id
          /check {email} -> check if the supplied email already has notifications enabled
       */

      if (!text) {
        responseBody.text = INVALID_MESSAGE;
        res.json(responseBody);
        return;
      }

      const senderUsername = req.body.message.chat.username;
      text = text.toLowerCase();

      if (text === '/start') {
        responseBody.text = getStartMessage();
      } else if (text.startsWith('/register')) {
        const tokens = text.split(' ');
        responseBody.text = await getRegisterMessage(tokens, senderUsername, chatId);
      } else {
        responseBody.text = INVALID_MESSAGE;
      }

      res.json(responseBody);
    });

    return new Promise((resolve, reject) => {
      app.listen(port, (err) => {
        if (err) reject(err);
        else {
          if (!PRODUCTION) {
            console.warn('Remember to install tunnelto and run -> tunnelto --port 3000 -s sadeaftest');
          }
          console.log(`Telegram webhook listening on: ${WEBHOOK_URL}`);
          resolve();
        }
      });
    });
  },
};
