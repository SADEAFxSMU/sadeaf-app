import server from './server';

export default async function TelegramWebhook() {
  if (!this.options.dev && this.options._build) {
    return;
  }

  if (this.options.target !== 'server') {
    return;
  }

  await server.start(4001);
}
