import express from "express";
import bodyParser from "body-parser";
import pubsub from "./pubsub"

export default {
  async start(port) {
    const {publish} = await pubsub()

    const app = express()
    app.use(bodyParser.json())

    app.post('/_hasura/webhook', async function (req, res, next) {
      // worker/queue names should match the name of the trigger
      let triggerName = req.body.trigger.name;
      await publish(triggerName, req.body)
      res.json({})
    })

    return new Promise((resolve, reject) => {
      app.listen(port, (err) => {
        if (err) reject(err)
        else {
          console.log(`Hasura webhook listening on: http://localhost:4000/_hasura/webhook`)
          resolve()
        }
      })
    })
  }
}
