<template>
  <div class="loading-page">
    <el-spinner />
  </div>
</template>

<script>
export default {
  name: 'app-home',
  middleware: ['authenticated'],
  mounted() {
    if (this.userType) {
      this.navigateToRoleHome();
    }
  },
  methods: {
    navigateToRoleHome() {
      this.$router.replace('/' + this.userType);
    },
  },
  computed: {
    userType() {
      return this.$store.state.auth.user.userType;
    },
  },
  watch: {
    userType() {
      this.navigateToRoleHome();
    },
  },
};
</script>

<style>
.loading-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
