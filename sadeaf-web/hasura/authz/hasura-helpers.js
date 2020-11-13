import fetch from 'node-fetch';
import { HASURA, BOOTSTRAP } from '../../config';

export async function getHasuraUserIdAndRole(user) {
  // user.sub contains the cognitoId
  let response = await hasuraRoleAndIdQuery(user.sub);
  let { data } = await response.json();

  if (!data || !data.account) {
    console.error('Did not receive expected json response from Hasura');
    return null;
  }

  if (!data.account[0]) {
    // No results -- user does not exist in `account` table based on cognito_id
    try {
      let resp = await createNewHasuraAccount(user);
      let {
        data: {
          insert_account_one: { id, role },
        },
      } = await resp.json();
      return { id, role };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  const { id, role } = data.account[0];
  return { id, role };
}

async function hasuraRoleAndIdQuery(cognitoId) {
  // Temporary script to change all account is_enabled statuses to true
  const query =`mutation MyMutation {
    update_account(_set: {is_enabled: true}, where: {}) {
      affected_rows
    }
  }`;

  // execute temp script
  await fetch(HASURA.GRAPHQL_API_URL, {
    headers: {
      'X-Hasura-Admin-Secret': HASURA.GRAPHQL_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query,
      operationName: 'MyMutation',
    }),
    method: 'POST',
  });

  return fetch(HASURA.GRAPHQL_API_URL, {
    headers: {
      'X-Hasura-Admin-Secret': HASURA.GRAPHQL_ADMIN_SECRET,
    },
    body: `{"query":"{account(where:{cognito_id:{_eq:\\"${cognitoId}\\"}}){ id role }}"}`,
    method: 'POST',
  });
}

function getRole(email) {
  if (isAdminEmail(email)) {
    return 'admin';
  }
  return 'pending';
}

function createNewHasuraAccount(user) {
  const operationName = 'CreateNewAccount';
  const query = `
    mutation ${operationName}($cognito_id: String!, $email: String!, $role: String!) {
      insert_account_one(
        object: {
          cognito_id: $cognito_id,
          email: $email,
          role: $role
          ${isAdminEmail(user.email) ? 'is_enabled: true' : ''}
        }
      ) { id role }
    }
  `;
  const email = user.email;
  const cognito_id = user.sub;
  const role = getRole(email);

  return fetch(HASURA.GRAPHQL_API_URL, {
    headers: {
      'X-Hasura-Admin-Secret': HASURA.GRAPHQL_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query,
      variables: { cognito_id, email, role },
      operationName,
    }),
    method: 'POST',
  });
}

function isAdminEmail(email) {
  return BOOTSTRAP.ADMIN_EMAIL.includes(email);
}
