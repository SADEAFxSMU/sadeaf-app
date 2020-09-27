import {Router} from "express";
import CognitoExpress from "cognito-express";
import fetch from 'node-fetch';
import {PRODUCTION, HASURA} from '../../config';

const cognitoExpress = new CognitoExpress({
  region: process.env.AWS_REGION || "ap-southeast-1",
  cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "ap-southeast-1_n6W18LYYn",
  tokenUse: "id",
  tokenExpiration: 3600000,
})

function handleDevAuthzRequest(req, res) {
  const expectedHeaders = [
    HASURA.FAEDAS_DEV_ADMIN_SECRET_HEADER,
    HASURA.FAEDAS_DEV_USER_ID_HEADER,
    HASURA.FAEDAS_DEV_USER_ROLE_HEADER
  ]
  const missing_headers = expectedHeaders.filter(h => !(h in req.headers) || req.headers[h] === '')
  if (missing_headers.length > 0) {
    return res.status(401).send('Missing headers: ' + missing_headers.join(', '))
  }

  const adminSecret = req.headers[HASURA.FAEDAS_DEV_ADMIN_SECRET_HEADER]
  const userId = req.headers[HASURA.FAEDAS_DEV_USER_ID_HEADER]
  const role = req.headers[HASURA.FAEDAS_DEV_USER_ROLE_HEADER]

  if (adminSecret === HASURA.GRAPHQL_ADMIN_SECRET) {
    return res.json({
      "X-Hasura-User-Id": userId,
      "X-Hasura-Role": role,
    })
  }
  return res.status(401).send('Provided admin secret is incorrect')
}

/**
 * Cognito Authenticated
 */
function authenticated(req, res, next) {
  const authorization = req.headers.authorization
  const parts = authorization && authorization.split(" ")
  const token = parts && parts[1]

  if (!token) {
    if (!PRODUCTION) {
      return handleDevAuthzRequest(req, res)
    }
    return res.status(401).send()
  }

  cognitoExpress.validate(token, function (err, response) {
    if (err) return res.status(401).send(err)
    next(response)
  })
}

const router = Router()
router.get('/_hasura/jwt/authorize', async function (req, res, next) {
  authenticated(req, res, async (user) => {
    const role = await getHasuraUserRole(user.sub);
    if (!role) {
      if (!PRODUCTION) {
        return handleDevAuthzRequest(req, res)
      }
      return res.status(401).send()
    }
    res.json({
      "X-Hasura-User-Id": user.sub,
      "X-Hasura-Role": role
    })
  })
})

async function getHasuraUserRole(cognitoId) {
  const response = await fetch(HASURA.GRAPHQL_API_URL, {
    headers: {
      'X-Hasura-Admin-Secret': HASURA.GRAPHQL_ADMIN_SECRET
    },
    "body": `{"query":"{account(where:{cognito_id:{_eq:\\"${cognitoId}\\"}}){ role }}"}`,
    method: "POST",
  });
  const { data } = await response.json();
  if (!data || !data.account) {
    console.error('Did not receive expected json response from Hasura');
    return null;
  }
  if (!data.account[0]) {
    // No results -- cognito id does not exist in the `account` table
    return null;
  }
  return data.account[0].role;
}

module.exports = router
