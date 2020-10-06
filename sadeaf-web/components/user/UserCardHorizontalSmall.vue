<template>
  <div class="profile" v-on="$listeners">
    <slot name="avatar">
      <div class="profile-pic">
        <img v-if="profile_pic_url" :src="profile_pic_url" class="image" />
        <el-avatar v-else class="el-icon-user-solid" size="small" />
      </div>
    </slot>
    <slot name="body">
      <h4 class="name">{{ name }}</h4>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'UserCardHorizontalSmall',

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  computed: {
    name() {
      return this.user.name;
    },
    profile_pic_url() {
      return this.user.profile_pic_url;
    },
  },
};
</script>

<style scoped>
.cell > :last-child {
  margin-right: 0;
}

.profile {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 10px;
}
.profile .profile-pic {
  display: flex;
  align-items: center;
}

.profile .image {
  margin: 2px;
  height: 30px;
  border-radius: 500px;
}

.profile .name {
  font-weight: normal;
  padding-left: 4px;
  margin-bottom: 0;
}
</style>
