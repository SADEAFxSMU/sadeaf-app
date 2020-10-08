<template>
  <div class="page">
    <h1 class="heading">New Users</h1>
    <pending-user-list />
  </div>
</template>

<script>
import PendingUserList from '../../../components/user/PendingUserList';
/**
 * Page for sadeaf admins to handle pending users
 */
export default {
  name: 'pending',
  components: { PendingUserList },
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page .heading {
  margin-bottom: 12px;
}
</style>
