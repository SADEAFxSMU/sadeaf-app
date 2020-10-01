<template>
  <div v-if="loading">
    <h1>LOADING...</h1>
  </div>
  <div v-else-if="user" class="user">
    <el-row type="flex" style="flex-wrap: wrap" :gutter="20">
      <el-col :xs="24" :md="8">
        <div class="profile">
          <img v-if="profilePicUrl" :src="profilePicUrl" class="profile-pic" />
          <el-avatar
            v-else
            class="el-icon-user-solid"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 150px;
              width: 150px;
              font-size: 70px;
            "
          />
          <div class="name">
            <h1>{{ name }}</h1>
            <role-tag :role="role" />
            <div class="user-stats">
              <span>102</span>
              <span>88</span>
              <span>56</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :md="16">
        <slot name="role-content" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import RoleTag from '../../RoleTag';

/**
 * Shows the user's details and other account info
 */
export default {
  name: 'BaseProfile',

  components: {
    RoleTag,
  },

  props: {
    user: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      required: true,
      default: true,
    },
  },

  computed: {
    name() {
      return this.user.name;
    },
    role() {
      const user = this.user;
      return (user.role && user.role) || 'USER';
    },
    email() {
      return this.user.email;
    },
    client() {
      return this.user.client;
    },
    events() {
      return this.client.events;
    },
    profilePicUrl() {
      const user = this.user;
      return user.profile_pic_url;
    },
  },
};
</script>

<style scoped>
.user {
  width: 100%;
  max-width: 1000px;
}
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.1);
  padding: 16px;
}
.profile-pic {
  border-radius: 4px;
  margin-bottom: 16px;
  width: 250px;
}
.name {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.name > * {
  margin: 3px;
}
</style>
