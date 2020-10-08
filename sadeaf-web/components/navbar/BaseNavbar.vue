<template>
  <el-menu class="el-menu-nav" mode="horizontal" router>
    <div class="nav-logo">
      <h1>SADEAF Dashboard</h1>
      <status-indicator text="LIVE" color="lightseagreen" class="indicator" />
    </div>
    <slot name="user-nav"></slot>
    <el-submenu index="/account">
      <template slot="title">Account</template>
      <el-menu-item :index="linkToProfile"> Profile </el-menu-item>
      <el-menu-item index="/account#settings"> Settings </el-menu-item>
      <el-menu-item
        v-if="this.$store.state.auth.user.role === 'client' || this.$store.state.auth.user.role === 'admin'"
        :index="`/${this.$store.state.auth.user.role}/account/blacklist`"
      >
        Blacklist
      </el-menu-item>
      <el-menu-item index="/account/notifications"> Notification Preferences </el-menu-item>
    </el-submenu>
    <el-menu-item>
      <logout-button />
    </el-menu-item>
  </el-menu>
</template>

<script>
import StatusIndicator from '../StatusIndicator';
import LogoutButton from '../buttons/LogoutButton';
export default {
  name: 'BaseNavbar',
  components: { LogoutButton, StatusIndicator },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    linkToProfile() {
      const user = this.user;
      const role = user[user.role];
      if (role) return `/${user.role}/${role.id}`;
      return '/account#profile';
    },
  },
};
</script>

<style scoped>
.el-menu-nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
}

.el-menu-nav .nav-logo {
  display: flex;
  align-items: center;
  flex: 1;
  outline: none;
}
.nav-logo .indicator {
  padding-left: 15px;
}
</style>
