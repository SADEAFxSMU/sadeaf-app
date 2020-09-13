<template>
  <el-menu class="el-menu-nav" mode="horizontal" router>
    <div class="nav-logo">
      <h1>SADEAF Dashboard</h1>
      <status-indicator text="LIVE" color="lightseagreen" class="indicator"/>
    </div>
    <slot name="user-nav"></slot>
    <el-menu-item index="/notifications">
      Notifications
    </el-menu-item>
    <el-submenu index="/account">
      <template slot="title">Account</template>
      <el-menu-item index="/account#profile">
        Profile
      </el-menu-item>
      <el-menu-item index="/account#settings">
        Settings
      </el-menu-item>
      <el-menu-item index="/account/notifications">
        Notification Preferences
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import StatusIndicator from "../../components/StatusIndicator";
export default {
  name: "BaseNavbar",
  components: {StatusIndicator},
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
