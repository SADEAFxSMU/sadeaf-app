import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
const {
  HASURA: { GRAPHQL_ENDPOINT },
} = require("../config");

const app = express();

// Authorization will be handled by Hasura due to WebSocket Header restrictions.
app.use(
  createProxyMiddleware("/api/graphql", {
    target: GRAPHQL_ENDPOINT,
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      "^/api/graphql": "/v1/graphql",
    },
  })
);

export default app;
