export default {
  async start() {
    await require('./email-example')();

    console.log('Hasura webhook workers started');
  },
};
