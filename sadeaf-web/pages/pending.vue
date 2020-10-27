<template>
  <div class="page">
    <div class="create-profile">
      <h1 class="title">Create Profile</h1>
      <div class="form-container">
        <client-sign-up-form />
      </div>
    </div>
  </div>
</template>

<script>
import ClientSignUpForm from '../components/forms/SignUpForm/ClientSignUpForm';
/**
 * Page that pending users will land on.
 * Pending users are those who:
 * 1. registered for account on cognito and verified email
 * 2. have yet to be on-boarded (set role) by sadeaf admin
 */
export default {
  name: 'pending',
  components: { ClientSignUpForm },
};
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  height: 100%;
}
.create-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
}
.create-profile .title {
  margin-bottom: 12px;
}
.create-profile .body {
  color: #5f5f75;
  line-height: 24px;
  text-justify: distribute;
}
.form-container {
}
</style>
