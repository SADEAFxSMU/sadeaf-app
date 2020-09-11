import express from "express";
import bodyParser from "body-parser";
import healthcheck from "express-healthcheck";

import worker from "./worker";

const app = express()

// TODO(fuxing): Maybe can remove this
app.use('/_healthcheck', healthcheck())

app.use(bodyParser.json())
app.use(require('./api/routes/accounts'))
app.use(require('./api/routes/hasura'))

worker().then(() => {

})

export default app
