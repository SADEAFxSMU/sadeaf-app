<template>
  <div class="layout">
    <el-container v-if="user" style="height: 100%">
      <el-header>
        <admin-navbar v-if="userType === 'admin'" />
        <client-navbar v-else-if="userType === 'client'" />
        <volunteer-navbar v-else-if="userType === 'volunteer'" />
        <service-requestor-navbar v-else-if="userType === 'service_requestor'" />
      </el-header>
      <el-main class="main">
        <nuxt />
      </el-main>
    </el-container>
    <div class="loading-page" v-else>
      <h1>
        SADEAF
        <el-spinner :radius="70" />
      </h1>
    </div>
  </div>
</template>

<script>
import AdminNavbar from '../components/navbar/admin';
import ClientNavbar from '../components/navbar/client';
import VolunteerNavbar from '../components/navbar/volunteer';
import UserSwitcher from '../components/dev_only/UserSwitcher';
import ServiceRequestorNavbar from '../components/navbar/service-requestor';

export default {
  components: { ServiceRequestorNavbar, UserSwitcher, AdminNavbar, ClientNavbar, VolunteerNavbar },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    userType() {
      return this.user && this.user.userType;
    },
  },
};
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

h1 {
  color: #47476b;
}
h2 {
  color: #686880;
}
h3 {
  color: #7f7f92;
}

.layout {
  height: 100vh;
  width: 100vw;
}

.main {
  background: #f4f5ff;
}

.loading-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
