<template>
  <div class="card">
    <div :style="cardStyle" class="body-wrapper">
      <slot name="avatar">
        <img v-if="user && user.imgSrc"
             :src="user.imgSrc"
             class="image" />
        <el-avatar v-else
                   class="el-icon-user-solid"
                   size="large" />
      </slot>
      <slot name="body">
        <div class="body">
          <div class="deets">
            <h3 class="name">{{ name }}</h3>
            <el-tag class="role" size="mini">{{ role }}</el-tag>
          </div>
          <div>
            {{ email }}
          </div>
        </div>
      </slot>
    </div>
    <div class="footer" v-if="$slots.footer">
      <slot name="footer">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
    },
    cardStyle: {
      type: [String, Object],
      required: false,
    },
    imgStyle: {
      type: [String, Object],
      required: false,
    }
  },
  computed: {
    name() {
      return this.user.name;
    },
    role() {
      const user = this.user;
      return (user.role && user.role.toUpperCase()) || 'USER';
    },
    email() {
      return this.user.email;
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 4px;
  box-shadow: 0 2px 6px 1px #d5d8ec;
  margin: 8px;
  flex: 1;
}
.body-wrapper {
  display: flex;
  align-items: center;
  padding: 16px;
}
.image {
  border-radius: 50%;
  box-shadow: 0 2px 6px 1px rgba(0,0,0,0.2);
}
.body {
  padding-left: 12px;
}
.deets {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.name {
}
.role {
  margin-left:
    6px;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  padding: 8px;
  background-color: rgba(0,0,50,0.05);
}
</style>
