import express from "express";
import bodyParser from "body-parser";
import {createProxyMiddleware} from "http-proxy-middleware";

const app = express()

app.use(createProxyMiddleware('/api/graphql', {
  target: process.env.SVC_SADEAF_HASURA_URL || 'http://localhost:8080',
  ws: true,
  changeOrigin: true,
  pathRewrite: {
    '^/api/graphql': '/v1/graphql'
  },
}))

app.use(bodyParser.json())
app.use(require('./routes/accounts'))

export default app
