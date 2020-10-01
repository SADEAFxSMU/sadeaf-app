<template>
  <el-tag class="role" size="mini" :type="elTagType">
    {{ role.toUpperCase() }}
  </el-tag>
</template>

<script>
import { ROLE_EL_TAG_TYPES } from '../common/types/constants';

export default {
  name: 'RoleTag',

  props: {
    role: {
      type: String,
      required: true,
    },
  },

  computed: {
    elTagType() {
      return ROLE_EL_TAG_TYPES[this.role] || 'primary';
    },
  },
};
</script>

<style scoped></style>
