const express = require('express')
const healthcheck = require('express-healthcheck')
const {createProxyMiddleware} = require('http-proxy-middleware')

const app = express()

app.use(require('./routes/accounts'))

app.use('/_healthcheck', healthcheck())
app.use('/graphql', createProxyMiddleware({
  target: process.env.SVC_SADEAF_HASURA_URL || 'http://localhost:8080',
  ws: true,
  pathRewrite: {
    '^/api/v1/graphql': '/graphql'
  }
}))

module.exports = app
