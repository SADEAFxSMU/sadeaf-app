import express from "express"
import {createProxyMiddleware} from "http-proxy-middleware"

const app = express()

// Authorization will be handled by Hasura due to WebSocket Header restrictions.
app.use(createProxyMiddleware('/api/graphql', {
  target: process.env.SVC_SADEAF_HASURA_URL || 'http://localhost:8080',
  ws: true,
  changeOrigin: true,
  pathRewrite: {
    '^/api/graphql': '/v1/graphql'
  },
}))

export default app
