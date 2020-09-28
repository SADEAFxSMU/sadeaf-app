<template>
  <el-button @click="logout">
    Logout
  </el-button>
</template>

<script>
export default {
  name: "LogoutButton",
  methods: {
    logout() {
      this.$auth.signOut();
      this.$router.replace('/sign-in');
    }
  }
};
</script>

<style scoped>

</style>
