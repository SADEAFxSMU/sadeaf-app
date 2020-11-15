import { EMAIL } from '../../../config';

export async function sendNotifications(notificationSettings, publish, { telegramMessage, email }) {
  if (!notificationSettings) {
    return;
  }

  if (email && email.message && notificationSettings.email_information) {
    const { message: emailMessage, subject: emailSubject, to } = email;

    await publish('email-sender', {
      from: EMAIL.FROM_EMAIL,
      to,
      subject: emailSubject,
      body: emailMessage,
    });
  }

  if (telegramMessage && notificationSettings.telegram_information) {
    await publish('telegram-sender', {
      message: telegramMessage,
      chatId: notificationSettings.telegram_information.chat_id,
    });
  }
}
