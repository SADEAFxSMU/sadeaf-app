import {
  INVALID_REGISTER_MESSAGE,
  START_MESSAGE,
  NOT_REGISTERED_USER,
  NOTIFICATION_NOT_ENABLED,
  TELEGRAM_NOT_ENABLED,
  USERNAME_MISMATCH,
  UPDATE_CHAT_ID_ERROR,
  REGISTER_SUCCESS,
} from './registration-messages';
import { executeGraphQLQuery, userAccountAndTelegramSettingsOpsDoc, addTelegramChatId } from './hasura-helpers';

export const getStartMessage = function () {
  return START_MESSAGE;
};

export const getRegisterMessage = async function (tokens, senderUsername, chatId) {
  // User did not specify email
  if (tokens.length !== 2) {
    return INVALID_REGISTER_MESSAGE;
  }

  const userEmail = tokens[1];
  const { data } = await executeGraphQLQuery(userAccountAndTelegramSettingsOpsDoc, 'UserAccountAndTelegramSettings', {
    email: userEmail,
  });

  if (data.account.length === 0) {
    return NOT_REGISTERED_USER;
  }

  const userAccount = data.account[0];
  if (!userAccount.notification_setting) {
    return NOTIFICATION_NOT_ENABLED;
  }

  if (!userAccount.notification_setting.telegram_information) {
    return TELEGRAM_NOT_ENABLED;
  }

  const dbUserTelegramUsername = userAccount.notification_setting.telegram_information.user_handle;
  if (dbUserTelegramUsername.toLowerCase() !== senderUsername.toLowerCase()) {
    return USERNAME_MISMATCH;
  }

  const addChatIdResponse = await executeGraphQLQuery(addTelegramChatId, 'AddTelegramChatId', {
    tele_handle: senderUsername,
    chat_id: chatId,
  });

  if (addChatIdResponse.errors || addChatIdResponse.affected_rows === 0) {
    return UPDATE_CHAT_ID_ERROR;
  }

  return REGISTER_SUCCESS;
};
