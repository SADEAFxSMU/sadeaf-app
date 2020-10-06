import server from './server';

export default async function TelegramWebhook() {
  if (this.options.target !== 'server') {
    return;
  }

  await server.start(4001);
}
