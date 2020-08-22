const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function (fastify, opts) {
  // This loads all plugins defined in plugins that are reused through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes-v1'),
    options: Object.assign({
      prefix: '/api/v1'
    }, opts)
  })

  // Proxy graphql to hasura
  fastify.register(require('fastify-http-proxy'), {
    upstream: process.env.SVC_SADEAF_HASURA_URL || 'http://localhost:8080',
    prefix: '/api/v1/graphql',
    rewritePrefix: '/v1/graphql'
  })

  // Under pressure healthcheck
  fastify.register(require('fastify-healthcheck'), {
    healthcheckUrl: '/_healthcheck'
  })
}
