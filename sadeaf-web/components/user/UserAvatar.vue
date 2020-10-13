<template>
  <div class="user-avatar">
    <img v-if="profilePicUrl" :src="profilePicUrl" class="image" :alt="`${name}'s profile picture`" />
    <el-avatar v-else class="el-icon-user-solid avatar-placeholder" size="large" />
    <div class="user-info">
      <h3 class="user-name">{{ name }}</h3>
      <role-tag :role="role" />
    </div>
  </div>
</template>

<script>
import RoleTag from '../RoleTag';
export default {
  name: 'UserAvatar',
  components: { RoleTag },
  props: {
    profilePicUrl: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'User',
    },
  },
};
</script>

<style scoped>
.user-avatar {
  display: flex;
  align-items: center;
}
.image {
  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  width: 50px;
}
.avatar-placeholder {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7em;
}
.user-info {
  padding: 0 0 0 12px;
}
.user-name {
  white-space: nowrap;
  padding: 0;
  line-height: 1em;
}
</style>
