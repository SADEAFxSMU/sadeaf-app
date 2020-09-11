import PgBoss from "pg-boss";

const {POSTGRES: {QUEUE_DATABASE_URL}} = require("./config")
const boss = new PgBoss(QUEUE_DATABASE_URL)

export default async function () {
  await boss.start()
  boss.on('error', error => console.error(error))

  return {
    async subscribe(queue, asyncJobHandler) {
      await boss.subscribe(queue, asyncJobHandler);
    },
    async publish(queue, data) {
      await boss.publish(queue, data)
    }
  }
}
