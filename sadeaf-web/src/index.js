import express from "express";
import bodyParser from "body-parser";
import healthcheck from "express-healthcheck";
import {createProxyMiddleware} from "http-proxy-middleware";

import worker from "./worker";

const app = express()

app.use('/_healthcheck', healthcheck())
app.use('/graphql', createProxyMiddleware({
  target: process.env.SVC_SADEAF_HASURA_URL || 'http://localhost:8080',
  ws: true,
  pathRewrite: {
    '^/api/v1/graphql': '/v1/graphql'
  },
}))

app.use(bodyParser.json())
app.use(require('./api/routes/accounts'))
app.use(require('./api/routes/hasura'))

worker().then(() => {

})

export default app
