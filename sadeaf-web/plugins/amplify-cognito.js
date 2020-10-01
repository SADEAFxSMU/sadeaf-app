import Amplify, { Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    // NOTE: Webpack requires this to be 'process.env.*' as itself, as it will be replaced in generate.
    region: process.env.AWS_COGNITO_REGION || "ap-southeast-1",
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "ap-southeast-1_n6W18LYYn",
    userPoolWebClientId: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID || "1m91mgkmmhi4bqchc5uecbg7t4",
  },
});

export default function (
  {
    app: {
      context: { route },
      router,
    },
  },
  inject
) {
  inject("auth", {
    /**
     * @return {Promise<>}
     */
    currentSession() {
      return Auth.currentSession();
    },
    /**
     * @return {Promise<boolean>}
     */
    async isAuthenticated() {
      const user = await Auth.currentUserInfo();
      return user?.username != null;
    },
    /**
     * @return {Promise<>}
     */
    signOut() {
      return Auth.signOut();
    },
  });
}
