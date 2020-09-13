export default {
  async start() {
    await require('./email-example')()
    await require('./chat-id-updater')()

    console.log('Hasura webhook workers started')
  }
}
