import {Router} from "express";
import CognitoExpress from "cognito-express";
import fetch from 'node-fetch';

const cognitoExpress = new CognitoExpress({
  region: process.env.AWS_REGION || "ap-southeast-1",
  cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "ap-southeast-1_n6W18LYYn",
  tokenUse: "id",
  tokenExpiration: 3600000,
})

/**
 * Cognito Authenticated
 */
function authenticated(req, res, next) {
  const authorization = req.headers.authorization
  const parts = authorization && authorization.split(" ")
  const token = parts && parts[1]

  if (!token) {
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
      return res.status(401).send();
    }
    res.json({
      "X-Hasura-User-Id": user.sub,
      "X-Hasura-Role": role
    })
  })
})

async function getHasuraUserRole(cognitoId) {
  const response = await fetch("http://localhost:3000/api/graphql", {
    headers: {
      'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'sadeaf-hasura-console'
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
