<template>
  <div class="ham-container">
    <div class="ham-button">
      <el-button icon="el-icon-menu" type="primary" @click="dialogVisible = true" />
      <el-dialog :visible="dialogVisible" @close="closeModal" fullscreen :modal-append-to-body="false">
        <admin-navbar v-if="userType === 'admin'" @select="handleNavMenuItemClick" />
        <client-navbar v-else-if="userType === 'client'" @select="handleNavMenuItemClick" />
        <volunteer-navbar v-else-if="userType === 'volunteer'" @select="handleNavMenuItemClick" />
        <service-requestor-navbar v-else-if="userType === 'service_requestor'" @select="handleNavMenuItemClick" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AdminNavbar from './admin';
import ClientNavbar from './client';
import VolunteerNavbar from './volunteer';
import ServiceRequestorNavbar from './service-requestor';
export default {
  name: 'HamburgerMenu',
  components: { ServiceRequestorNavbar, VolunteerNavbar, ClientNavbar, AdminNavbar },
  props: {
    userType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    closeModal() {
      this.dialogVisible = false;
    },
    handleNavMenuItemClick() {
      // Set a timeout instead of immediately collapsing to prevent
      // jittery rendering when the dialog fades away
      setTimeout(() => (this.dialogVisible = false), 70);
    },
  },
};
</script>

<style scoped>
.ham-container {
  position: relative;
  width: 100%;
}
.ham-button {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
