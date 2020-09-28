import jwtDecode from "jwt-decode";
import gql from "graphql-tag";
import { Auth } from "aws-amplify";

/**
 * Query hasura for the user's role with the authenticated apollo client, then
 * cache it in the nuxt vuex store.
 * @param apolloClient
 * @param vuexStore
 * @returns {Promise<void>}
 */
async function queryAndSetUserInfo(apolloClient, vuexStore) {
  const jwtToken = await Auth.currentSession()
    .then((session) => {
      return session.getIdToken().getJwtToken()
    })
    .catch(() => null);
  if (!jwtToken) {
    // Jwt unavailable - user is probably not logged in, hence skip
    return
  }
  const cognitoId = jwtDecode(jwtToken).sub;
  const { data } = await apolloClient.query({
    query: gql`{
      user: account(
        where: {
          cognito_id: {_eq: "${cognitoId}"}
        }
      ) {
        id
        name
        email
        role
      }
    }`
  })
  let user = data.user[0];
  vuexStore.commit('auth/setUser', { userType: user.role, user });
}

export default ({ app, store }, inject) => {
  const apolloClient = app.apolloProvider && app.apolloProvider.defaultClient;
  if (!apolloClient) {
    throw Error(
      "Apollo client not initialised - unable to query hasura for user's role.\n" +
      "Ensure that the apollo plugin is set up before this."
    );
  }
  queryAndSetUserInfo(apolloClient, store);
}
