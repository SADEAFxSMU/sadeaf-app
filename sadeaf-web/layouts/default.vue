<template>
  <div>
    <el-container>
      <el-header>
        <admin-navbar v-if="userType === 'admin'"/>
        <client-navbar v-else-if="userType === 'client'"/>
        <volunteer-navbar v-else-if="userType === 'volunteer'"/>
      </el-header>
      <el-main style="background: #f4f5ff; min-height: 95vh;">
        <nuxt/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import AdminNavbar from "./navbar/admin";
import ClientNavbar from "./navbar/client";
import VolunteerNavbar from "./navbar/volunteer";

export default {
  components: {AdminNavbar, ClientNavbar, VolunteerNavbar},
  computed: {
    userType() {
      // TODO: Set navbar based on user type / role
      return 'client';
    }
  }
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
</style>
