<template>
  <div class="profile" v-on="$listeners">
    <slot name="avatar">
      <img v-if="user && user.imgSrc" :src="user.imgSrc" class="image" />
      <el-avatar v-else class="el-icon-user-solid" size="small" />
    </slot>
    <slot name="body">
      <h4 class="name">{{ user && user.name }}</h4>
    </slot>
  </div>
</template>

<script>
export default {
  name: "UserCardHorizontalSmall",
  props: {
    user: {
      type: Object,
      required: true,
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

.profile .image {
  margin: 2px;
  height: 30px;
  border-radius: 500px;
}

.profile .name {
  font-weight: normal;
  padding-left: 4px;
}
</style>
