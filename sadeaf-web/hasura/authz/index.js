import {Router} from "express";
import CognitoExpress from "cognito-express";
import {getHasuraUserIdAndRole} from "./hasura-helpers";

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
    const userInfo = await getHasuraUserIdAndRole(user);
    if (!userInfo) {
      return res.status(401).send();
    }

    const { id, role } = userInfo;

    res.json({
      "X-Hasura-User-Id": id.toString(),
      "X-Hasura-Role": role
    })
  })
})

module.exports = router
