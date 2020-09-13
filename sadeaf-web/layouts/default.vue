<template>
  <div>
    <user-switcher v-if="isDev" v-model="userType"/>
    <el-container>
      <el-header>
        <admin-navbar v-if="userType === 'admin'"/>
        <client-navbar v-else-if="userType === 'client'"/>
        <volunteer-navbar v-else-if="userType === 'volunteer'"/>
        <service_requestor-navbar v-else-if="userType === 'service_requestor'"/>
      </el-header>
      <el-main class="main">
        <nuxt/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AdminNavbar from "./navbar/admin";
import ClientNavbar from "./navbar/client";
import VolunteerNavbar from "./navbar/volunteer";
import UserSwitcher from "../components/dev_only/UserSwitcher";
import Service_requestorNavbar from "./navbar/service_requestor";

export default {
  components: {Service_requestorNavbar, UserSwitcher, AdminNavbar, ClientNavbar, VolunteerNavbar},

  data() {
    return {
      userType: 'admin',
    }
  },

  computed: {
    isDev() {
      return process.env.NODE_ENV !== 'production';
    }
  },
};
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
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

.main {
  background: #f4f5ff;
  min-height: 95vh;
}
</style>
