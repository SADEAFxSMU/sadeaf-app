export default {
  async start() {
    await require('./email/email-sender')();
    await require('./telegram-sender')();
    await require('./assignment-status-updater')();
    await require('./assignment-notifier')();
    await require('./assignment-details-update-notifier')();

    console.log('Hasura webhook workers started');
  },
};
