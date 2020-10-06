<template>
  <div class="page">
    <div class="notice">
      <h1 class="title">Pending Account Verification</h1>
      <p class="body">Your account is currently being verified by the SADEAF team.</p>
    </div>
  </div>
</template>

<script>
/**
 * Page that pending users will land on.
 * Pending users are those who:
 * 1. registered for account on cognito and verified email
 * 2. have yet to be on-boarded (set role) by sadeaf admin
 */
export default {
  name: 'pending',
};
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.notice {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.notice .title {
  margin-bottom: 12px;
}
.notice .body {
  color: #5f5f75;
  line-height: 24px;
  text-justify: distribute;
}
</style>
