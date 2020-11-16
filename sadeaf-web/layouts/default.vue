<template>
  <div class="layout">
    <div v-if="user" style="height: 100%">
      <header v-if="user.is_enabled && user.role !== 'pending'">
        <div class="nav-logo">
          <nuxt-link to="/">
            <h1>SADEAF Dashboard</h1>
          </nuxt-link>
          <status-indicator text="LIVE" color="lightseagreen" class="indicator" />
        </div>
        <hamburger-menu :user-type="userType" v-if="isMobileView" />
        <div v-else style="flex: 1; display: flex">
          <div style="flex: 1"></div>
          <admin-navbar v-if="userType === 'admin'" />
          <client-navbar v-else-if="userType === 'client'" />
          <volunteer-navbar v-else-if="userType === 'volunteer'" />
          <service-requestor-navbar v-else-if="userType === 'service_requestor'" />
        </div>
      </header>
      <main class="main">
        <nuxt />
      </main>
    </div>
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
import StatusIndicator from '../components/StatusIndicator';
import { isMobileViewMixin } from '../common/mixins';
import HamburgerMenu from '../components/navbar/HamburgerMenu';

export default {
  components: {
    HamburgerMenu,
    StatusIndicator,
    ServiceRequestorNavbar,
    UserSwitcher,
    AdminNavbar,
    ClientNavbar,
    VolunteerNavbar,
  },

  mixins: [isMobileViewMixin],

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

header {
  position: fixed;
  z-index: 1000;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 60px;
  background: white;
}

body {
  background: #f4f5ff;
}

.main {
  padding: 70px 20px 10px 20px;
}

.loading-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  outline: none;
  white-space: nowrap;
  padding-left: 20px;
}
.nav-logo .indicator {
  padding-left: 15px;
}

.nuxt-link-active {
  text-decoration-line: none;
}
</style>
