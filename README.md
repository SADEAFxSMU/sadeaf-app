# The mono repo for the SADEAF App

## `sadeaf-api`

This module contains the api of the sadeaf app powered by fastify.
Fastify is a fast and low overhead web framework for Node.js.

## `sadeaf-hasura` 

This module contains the GraphQL API of the sadeaf app build with Hasura and Postgres.
Hasura gives you instant GraphQL APIs on your postgres database. 

## `sadeaf-web` 

This module contains the front-end of the sadeaf app created with Nuxt.js.
Nuxt.js is a free and open source web application framework based on Vue.js, Node.js, Webpack and Babel.js. 

## `sadeaf-worker` 

This module contains the background workers of the sadeaf app.
SADEAF worker is just a single node.js application with a fastify API for healthcheck interfacing.
