<!--suppress HtmlUnknownTag -->
<template>
  <div class="amplify-container">
    <amplify-authenticator username-alias="email">
      <amplify-sign-up slot="sign-up" username-alias="email" :form-fields.prop="formFields"/>
      <amplify-sign-in slot="sign-in" username-alias="email"/>
    </amplify-authenticator>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    }
  }
};
</script>

<style scoped>
.amplify-container {
  display: flex;

  justify-content: center;

  padding: 24px;
}
</style>
