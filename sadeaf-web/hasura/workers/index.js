export default {
  async start() {
    await require('./email-example')();
    await require('./assignment-status-updater')();

    console.log('Hasura webhook workers started');
  },
};
