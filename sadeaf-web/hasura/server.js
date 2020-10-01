import express from "express";
import bodyParser from "body-parser";
import pubsub from "./pubsub";

export default {
  async start(port) {
    const { publish } = await pubsub();

    const app = express();
    app.use(bodyParser.json());

    app.post("/_hasura/webhook/:queue", async function (req, res, next) {
      await publish(req.params.queue, req.body);
      res.json({});
    });

    app.use(require("./authz"));

    return new Promise((resolve, reject) => {
      app.listen(port, (err) => {
        if (err) reject(err);
        else {
          console.log(`Hasura webhook listening on: http://localhost:4000/_hasura/webhook`);
          resolve();
        }
      });
    });
  },
};
