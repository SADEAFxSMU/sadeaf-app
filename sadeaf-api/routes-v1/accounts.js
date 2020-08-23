module.exports = async function (fastify, opts) {
  // TODO(austin): API Gateway route for Amazon Cognito related features e.g. /accounts/*

  fastify.get('/accounts', async function (request, reply) {
    return {help: 'no'}
  })
}
