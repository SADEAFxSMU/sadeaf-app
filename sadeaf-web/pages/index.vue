<template>
  <div class="loading-page">
    <el-spinner />
  </div>
</template>

<script>
import { ROLE_PROFILE_PAGE_MAPPING } from '../common/types/constants';

export default {
  name: 'app-home',
  middleware: ['authenticated'],
  mounted() {
    if (this.user) {
      this.navigateToRoleHome();
    }
  },
  methods: {
    navigateToRoleHome() {
      const { is_enabled, userType } = this.user;
      if (userType === 'pending') {
        this.redirectTo('/registration');
      } else if (!is_enabled) {
        this.redirectTo('/pending');
      } else {
        const roleHomePage = ROLE_PROFILE_PAGE_MAPPING[userType];
        this.redirectTo(roleHomePage);
      }
    },
    redirectTo(route) {
      this.$router.replace(route);
    },
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  watch: {
    user() {
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
