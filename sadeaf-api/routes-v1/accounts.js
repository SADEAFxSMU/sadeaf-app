module.exports = async function (fastify, opts) {
  // TODO(austin): API Gateway route for Amazon Cognito related features e.g. /accounts/*

  fastify.get('/accounts', async function (request, reply) {
    return {help: 'no'}
  })

  fastify.post('/accounts/updateDetails', async function (request, reply) {
    const {name, username, password, email} = request.body;
    // TODO: Store endpoints in constants folder?
    const hasuraUrl = "http://localhost:8080/v1/graphql";

    try {
      // TODO: Send new profile details to Cognito as well
      // TODO: Handle password change
      const res = await fastify.axios.post(hasuraUrl, {
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        query: `
          mutation MyMutation($username: String!, $name: String!, $email: String!, $password: String!) {
            update_account(where: {username: {_eq: $username}}, _set: {name: $name, email: $email}) {
              affected_rows
              returning {
                name
                username
                email
              }
            }
          }
        `,
        variables: {
          name,
          username,
          password,
          email
        }
      });
      if (res.data.errors) {
        console.log("Errors", res.data.errors);
        throw Error("Error mutating profile details!");
      }
      return reply.code(200).send({message: "Successfully updated profile details!"});
    } catch (e) {
      return reply.code(400).send({message: "Failed to update profile details!"})
    }
  })
}
