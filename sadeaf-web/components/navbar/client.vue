<template>
  <base-navbar v-on="$listeners">
    <template v-slot:user-nav>
      <el-menu-item index="/client"> Service Requests </el-menu-item>

      <el-menu-item data-test="client-feedback" index="/client/feedback"> Feedback </el-menu-item>
    </template>
  </base-navbar>
</template>

<script>
import BaseNavbar from './BaseNavbar';

export default {
  name: 'client-navbar',
  components: { BaseNavbar },
};
</script>

<style scoped></style>
