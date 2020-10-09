import { HASURA } from '../config';
import fetch from 'node-fetch';

export async function executeGraphQLQuery(operationsDoc, operationName, variables) {
  const result = await fetch(HASURA.GRAPHQL_API_URL, {
    headers: {
      'X-Hasura-Admin-Secret': HASURA.GRAPHQL_ADMIN_SECRET,
    },
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export const userAccountAndTelegramSettingsOpsDoc = `
  query UserAccountAndTelegramSettings($email: String) {
    account(where: {email: {_eq: $email}}) {
      id
      notification_setting {
        id
        telegram_information {
          id
          chat_id
          user_handle
        }
      }
    }
  }
`;

export const addTelegramChatId = `
  mutation AddTelegramChatId($tele_handle: String!, $chat_id: bigint!) {
    update_telegram_information(where: {user_handle: {_ilike: $tele_handle}}, _set: {chat_id: $chat_id}) {
      affected_rows
    }
  }
`;
