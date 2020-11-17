<template>
  <el-menu class="el-menu-nav" :mode="isMobileView ? 'vertical' : 'horizontal'" router @select="handleSelect">
    <slot name="user-nav"></slot>
    <el-submenu index="/account">
      <template slot="title">Account</template>
      <el-menu-item :index="linkToProfile"> Profile </el-menu-item>
      <el-menu-item index="/account#settings"> Settings </el-menu-item>
      <el-menu-item
        v-if="this.$store.state.auth.user.role === 'client'"
        :index="`/${this.$store.state.auth.user.role}/account/blacklist`"
      >
        Blacklist
      </el-menu-item>
      <el-menu-item index="/account/notifications"> Notification Preferences </el-menu-item>
    </el-submenu>
    <el-menu-item>
      <logout-button data-test="logout-button" />
    </el-menu-item>
  </el-menu>
</template>

<script>
import StatusIndicator from '../StatusIndicator';
import LogoutButton from '../buttons/LogoutButton';
import { isMobileViewMixin } from '../../common/mixins';
export default {
  name: 'BaseNavbar',
  mixins: [isMobileViewMixin],
  components: { LogoutButton, StatusIndicator },
  methods: {
    handleSelect(e) {
      this.$emit('select', e);
    },
  },
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
  padding: 0 20px 0 20px;
  border: none;
  overflow: scroll;
  height: 100%;
}
</style>
