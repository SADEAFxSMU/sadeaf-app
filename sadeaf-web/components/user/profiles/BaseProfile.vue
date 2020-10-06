<template>
  <div v-if="loading">
    <h1>LOADING...</h1>
  </div>
  <div v-else-if="user" class="user">
    <el-row type="flex" style="flex-wrap: wrap;" :gutter="20">
      <el-col :xs="24" :md="8">
        <div class="profile">
          <div class="avatar">
            <img v-if="profilePicUrl"
                 :src="profilePicUrl"
                 :alt="`${name}'s profile picture`"
                 class="profile-pic" />
            <el-avatar v-else
                       class="el-icon-user-solid profile-pic"
                       style="display: flex; justify-content: center; align-items: center; height: 150px; width: 150px; font-size: 70px;" />
            <role-tag :role="role"
                      class="role" />
          </div>
          <div class="user-info">
            <h1 class="name">
              {{ name }}
            </h1>
            <a class="link" :href="`mailto:${email}`" target="_blank">{{ email }}</a>
            <div class="user-stats">
              <div v-if="createdAt"
                   class="joined">
                <span>
                  Joined {{ createdAt }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :md="16">
        <slot name="role-content"/>
      </el-col>
    </el-row>
    <slot name="role-body" />
  </div>
</template>

<script>
import RoleTag from "../../RoleTag";
import { DateUtils } from "../../../common/date-utils";

/**
 * Shows the user's details and other account info
 */
export default {
  name: "BaseProfile",

  components: {
    RoleTag
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
    }
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
    createdAt() {
      return DateUtils.humanReadableMonthYear(this.user.created_at) || undefined;
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
  border-radius: 6px;
  padding: 16px;
}
.profile-pic {
  border-radius: 50%;
  margin-bottom: 16px;
  width: 250px;
  box-shadow: 2px 2px 8px 1px #cccce7;
}
.avatar {
  position: relative;
}
.role {
  position: absolute;
  bottom: 12px;
  right: 12px;
  box-shadow: 1px 1px 6px 1px #dbdbf5;
}
.user-info {
  display: flex;
  flex-direction: column;
}
.name {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.link {
  color: #6f97ff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}
.link:hover {
  color: #f8637a;
}
.joined {
  color: #797994;
  margin-top: 12px;
  font-size: 0.8em;
}
</style>
