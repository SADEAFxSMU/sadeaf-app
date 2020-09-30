import Amplify, {Auth} from 'aws-amplify';
import {onAuthUIStateChange, AuthState} from '@aws-amplify/ui-components'
import '@aws-amplify/ui-vue';


Amplify.configure({
  Auth: {
    region: process.env.AWS_REGION || "ap-southeast-1",
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || "ap-southeast-1_n6W18LYYn",
    userPoolWebClientId: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID || "1m91mgkmmhi4bqchc5uecbg7t4",
  }
})

function getPath(authState) {
  switch (authState) {
    case AuthState.SignIn:
      return '/sign-in'
    case AuthState.SignUp:
      return '/sign-up'
    case AuthState.ForgotPassword:
      return '/forget-password'
    case AuthState.ConfirmSignUp:
      return '/confirm-sign-up'
  }
}

export default function (context, inject) {
  onAuthUIStateChange((authState, authData) => {
    const path = getPath(authState)

    if (path) {
      window.history.replaceState({}, document.title, path)
    }
  })

  inject('auth', {
    /**
     * @return {Promise<>}
     */
    currentSession() {
      return Auth.currentSession()
    },
    /**
     * @return {Promise<boolean>}
     */
    async isAuthenticated() {
      const user = await Auth.currentUserInfo()
      return user?.username != null
    },
    /**
     * @return {Promise<>}
     */
    signOut() {
      return Auth.signOut()
    }
  })

  // TODO(fuxing): handleAuthState
}
