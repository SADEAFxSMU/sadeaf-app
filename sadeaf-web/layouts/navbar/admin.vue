<template>
  <el-menu :default-active="activeIndex" class="el-menu-nav" mode="horizontal" @select="handleSelect">
    <div class="nav-logo">
      <h1>SADEAF Dashboard</h1>
      <status-indicator text="LIVE" color="lightseagreen" class="indicator"/>
    </div>
    <el-menu-item index="/admin">
      Service Requests
    </el-menu-item>
    <el-submenu index="/admin/users"> <!-- TODO: make top level button clickable to route to /users -->
      <template slot="title">User Management</template>
      <el-menu-item index="/admin/users?type=clients">
        Clients
      </el-menu-item>
      <el-menu-item index="/admin/users?type=service-requestors">
        Service Requestors
      </el-menu-item>
      <el-menu-item index="/admin/users?type=volunteers">
        Volunteers
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="/notifications">
      Notifications
    </el-menu-item>
    <el-submenu index="/account"> <!-- TODO: make top level button clickable to route to /account -->
      <template slot="title">Account</template>
      <el-menu-item index="/account#profile">
        Profile
      </el-menu-item>
      <el-menu-item index="/account#settings">
        Settings
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import StatusIndicator from "../../components/StatusIndicator";

export default {
  name: "admin-navbar",
  components: {StatusIndicator},
  data() {
    return {
      activeIndex: '/admin',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key);
    }
  }
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
