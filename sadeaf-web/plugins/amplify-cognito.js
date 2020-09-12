import Amplify, {Auth} from 'aws-amplify';
import '@aws-amplify/ui-vue';

Amplify.configure({
  Auth: {
    region: process.env.AWS_REGION || "ap-southeast-1",
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "ap-southeast-1_n6W18LYYn",
    userPoolWebClientId: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID || "1m91mgkmmhi4bqchc5uecbg7t4",
  }
})

export default function (context, inject) {
  inject('auth', {
    /**
     * @return {Promise<>}
     */
    currentSession() {
      return Auth.currentSession()
    },
    async isAuthed() {
      const user = await Auth.currentUserInfo()
      return user.username != null
    },
    async hasGroup(group) {
      const session = await Auth.currentSession()
      const payload = await session.getIdToken().decodePayload()
      const groups = payload['cognito:groups'] || []

      return groups.includes(group)
    },
    /**
     * @return {Promise<>}
     */
    signOut() {
      return Auth.signOut()
    }
  })
}
