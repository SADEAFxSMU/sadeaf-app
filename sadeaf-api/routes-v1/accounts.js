module.exports = async function(fastify, opts) {
  // TODO(austin): API Gateway route for Amazon Cognito related features e.g. /accounts/*

  fastify.get('/accounts', async function(request, reply) {
    return { help: 'no' };
  });

  fastify.post('/accounts/updatePassword', async function(request, reply) {
    const { username, newPassword, currentPassword } = request.body;
    // TODO: Store endpoints in constants folder?
    const hasuraUrl = 'http://localhost:8080/v1/graphql';
    try {
      // TODO: Send new password details to Cognito as well
      const res = await fastify.axios.post(hasuraUrl, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        query: `
          mutation MyMutation($username: String!, $currentPassword: String!, $newPassword: String!) {
          update_account(where: {
            username: {_eq: $username},
            password: {_eq: $currentPassword}
          }, _set: {
            password: $newPassword,
          }) {
            affected_rows
          }
        }
        `,
        variables: {
          username,
          newPassword,
          currentPassword,
        },
      });
      if (res.data.errors || res.data.affected_rows === 0) {
        console.log('Errors', res.data.errors);
        throw Error('Error mutating password!');
      }

      return reply.code(200).send({ message: 'Successfully updated password!' });
    } catch (e) {
      console.log(e);
      return reply.code(400).send({ message: 'Failed to update password!' });
    }
  });

  fastify.post('/accounts/updateDetails', async function(request, reply) {
    const { name, username, email, contact } = request.body;
    // TODO: Store endpoints in constants folder?
    const hasuraUrl = 'http://localhost:8080/v1/graphql';
    try {
      // TODO: Send new profile details to Cognito as well
      const res = await fastify.axios.post(hasuraUrl, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        query: `
          mutation MyMutation($username: String!, $name: String!, $email: String!, $contact: String!) {
            update_account(where: {username: {_eq: $username}}, _set: {contact: $contact, name: $name, email: $email}) {
              affected_rows
              returning {
                name
                username
                email
                contact
              }
            }
          }
        `,
        variables: {
          name,
          username,
          email,
          contact: contact + '',
        },
      });
      if (res.data.errors) {
        console.log('Errors', res.data.errors);
        throw Error('Error mutating profile details!');
      }
      return reply.code(200).send({ message: 'Successfully updated profile details!' });
    } catch (e) {
      console.log(e);
      return reply.code(400).send({ message: 'Failed to update profile details!' });
    }
  });
};
