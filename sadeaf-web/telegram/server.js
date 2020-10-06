import express from 'express';
import bodyParser from 'body-parser';
import { PRODUCTION } from '../config';

const {
  TELEGRAM: { WEBHOOK_URL },
} = require('../config');

export default {
  async start(port) {
    const app = express();
    app.use(bodyParser.json());

    app.post('/_telegram/webhook', async function (req, res, _) {
      // TODO(wy): Add create telegram account logic to kick state telegram registration
      res.status(200).send();
    });

    return new Promise((resolve, reject) => {
      app.listen(port, (err) => {
        if (err) reject(err);
        else {
          if (!PRODUCTION) {
            console.warn('Remember to install tunnelto and run -> tunnelto --port 4001 -s sadeaftest');
          }
          console.log(`Telegram webhook listening on: ${WEBHOOK_URL}`);
          resolve();
        }
      });
    });
  },
};
