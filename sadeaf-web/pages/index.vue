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
    if (this.userType) {
      this.navigateToRoleHome();
    }
  },
  methods: {
    navigateToRoleHome() {
      this.$router.replace(ROLE_PROFILE_PAGE_MAPPING[this.userType] || '/pending');
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
