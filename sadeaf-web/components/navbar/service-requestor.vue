<template>
  <base-navbar>
    <template v-slot:user-nav>
      <el-menu-item index="/org"> Service Requests </el-menu-item>
    </template>
  </base-navbar>
</template>

<script>
import BaseNavbar from "./BaseNavbar";

export default {
  name: "service-requestor-navbar",
  components: { BaseNavbar },
};
</script>

<style scoped></style>
