<template>
  <base-navbar>
    <template v-slot:user-nav>
      <el-menu-item index="/admin">
        Service Requests
      </el-menu-item>
      <el-submenu index="/admin/users">
        <template slot="title">User Management</template>
        <el-menu-item index="/admin/users">
          All Users
        </el-menu-item>
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
    </template>
  </base-navbar>
</template>

<script>
import BaseNavbar from "./BaseNavbar";
export default {
  name: "admin-navbar",
  components: {BaseNavbar},
};
</script>

<style scoped>

</style>
