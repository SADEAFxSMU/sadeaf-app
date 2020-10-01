<!--suppress HtmlUnknownTag -->

<template>
  <div class="amplify-container">
    <amplify-authenticator username-alias="email" :initial-auth-state="state">
      <amplify-sign-in slot="sign-in" username-alias="email"/>
      <amplify-sign-up slot="sign-up" username-alias="email"
                       :form-fields.prop="signUp.formFields"
      />
      <amplify-confirm-sign-up slot="confirm-sign-up"
                               username-alias="email"
                               header-text="Verify your email address"
                               submit-button-text="Verify"
                               :form-fields.prop="confirmSignUp.formFields"
      />
    </amplify-authenticator>
  </div>
</template>

<script>
import {onAuthUIStateChange, AuthState} from '@aws-amplify/ui-components'
import '@aws-amplify/ui-vue';

const AuthRouting = {}
AuthRouting[AuthState.SignedIn] = {path: '/', push: true}
AuthRouting[AuthState.ConfirmSignUp] = {path: '/confirm-sign-up', push: true}
AuthRouting[AuthState.SignIn] = {path: '/sign-in'}
AuthRouting[AuthState.SignUp] = {path: '/sign-up'}
AuthRouting[AuthState.ForgotPassword] = {path: '/forget-password'}

export default {
  name: "AmplifyContainer",
  props: {
    state: {
      type: String,
      required: true,
    }
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      // Ignore if state did not change.
      if (this.state === authState) {
        return
      }

      const {path, push} = AuthRouting[authState]
      if (push) {
        this.$router.push({path: path})
      } else {
        window.history.replaceState({}, document.title, path)
      }
    })
  },
  beforeDestroy() {
    return onAuthUIStateChange
  },
  data() {
    return {
      signUp: {
        formFields: [
          {
            type: 'email',
            label: 'Email Address',
            placeholder: 'Email',
            required: true,
          },
          {
            type: 'password',
            label: 'Password',
            placeholder: 'Password',
            required: true,
          },
          {
            type: 'phone_number',
            label: 'Phone Number',
            dialCode: '+65',
            placeholder: '8765 4321',
            required: true,
          }
        ]
      },
      confirmSignUp: {
        formFields: [
          {
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email address',
            required: true,
          },
          {
            type: 'code',
            label: 'Verification Code',
            placeholder: 'Code',
          },
        ]
      }
    }
  }
}
</script>

<style scoped>
.amplify-container {
  display: flex;
  justify-content: center;
}
</style>
