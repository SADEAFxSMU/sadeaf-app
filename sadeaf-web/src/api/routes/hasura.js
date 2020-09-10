import {Router} from "express";
import pubsub from "../../pubsub";

const router = Router()

pubsub().then(({publish}) => {

  router.post('/hasura/webhook/:queue', async function (req, res, next) {
    await publish(req.params.queue, req.body)
    res.json({})
  })

})


module.exports = router
