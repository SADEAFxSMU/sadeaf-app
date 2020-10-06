<template>
  <base-navbar>
    <template v-slot:user-nav>
      <el-menu-item index="/volunteer"> Service Requests </el-menu-item>
    </template>
  </base-navbar>
</template>

<script>
import BaseNavbar from './BaseNavbar';

export default {
  name: 'volunteer-navbar',
  components: { BaseNavbar },
};
</script>

<style scoped></style>
