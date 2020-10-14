import server from './server';
import workers from './workers';

export default async function HasuraWebhook() {
  if (!this.options.dev && this.options._build) {
    return;
  }

  if (this.options.target !== 'server') {
    return;
  }

  await workers.start();
  await server.start(4000);
}
