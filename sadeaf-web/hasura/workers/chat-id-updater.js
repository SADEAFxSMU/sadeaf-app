import pubsub from "../pubsub";

/*
Worker that listens for user handle updates on the telegram-information table.
Upon receiving an update, it should kick start the process for updating the chat id
based on the new user handle
 */
module.exports = async function () {
  const {subscribe} = await pubsub()

  await subscribe('chat-id-updater', async ({data}) => {
    await new Promise((resolve, reject) => {
      try {
        // old values of the telegram-information table
        let oldValues = data.event.data.old;
        // new values of the telegram-information table
        let newValues = data.event.data.new;
        console.log('old user handle', oldValues.user_handle);
        console.log('new user handle', newValues.user_handle);
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  })
}
