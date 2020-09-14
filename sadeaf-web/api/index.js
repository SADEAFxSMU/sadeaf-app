import express from "express";
import bodyParser from "body-parser";
import {createProxyMiddleware} from "http-proxy-middleware";
import CognitoExpress from "cognito-express";

const cognitoExpress = new CognitoExpress({
  region: process.env.AWS_REGION || "ap-southeast-1",
  cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "ap-southeast-1_n6W18LYYn",
  tokenUse: "id",
  tokenExpiration: 3600000,
})

const app = express()

/**
 * Cognito Authenticated
 */
function authenticated(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send()
  }

  cognitoExpress.validate(token, function (err, response) {
    if (err) return res.status(401).send(err)

    res.locals.user = response
    next()
  })
}

app.use(bodyParser.json())
app.use(authenticated)
app.use(createProxyMiddleware('/api/graphql', {
  target: process.env.SVC_SADEAF_HASURA_URL || 'http://localhost:8080',
  ws: true,
  changeOrigin: true,
  pathRewrite: {
    '^/api/graphql': '/v1/graphql'
  },
}))

app.use(require('./routes/accounts'))

export default app
