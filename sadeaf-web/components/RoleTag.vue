<template>
  <el-tag class="role"
          size="mini"
          :type="elTagType">
    {{ role.toUpperCase() }}
  </el-tag>
</template>

<script>
import { ROLES } from "../common/types/constants";

export const ROLE_EL_TAG_TYPES = {
  [ROLES.admin]: 'primary',
  [ROLES.client]: 'danger',
  [ROLES.volunteer]: 'success',
  [ROLES.service_requestor]: 'danger',
}

export default {
  name: "RoleTag",

  props: {
    role: {
      type: String,
      required: true,
    }
  },

  computed: {
    elTagType() {
      return ROLE_EL_TAG_TYPES[this.role] || 'primary';
    }
  }
};
</script>

<style scoped>

</style>
