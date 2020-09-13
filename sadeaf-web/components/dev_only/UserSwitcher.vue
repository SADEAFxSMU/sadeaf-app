<template>
  <div class="user-switcher">
    <el-menu default-active="/admin" router class="user-menu">
      <el-submenu index="">
        <template v-slot:title>
          <div>
            <el-icon name="user" /> {{ value }}
          </div>
        </template>
        <el-menu-item v-for="user in userTypes"
                      :key="'user-' + user.type"
                      :index="user.home"
                      @click="handleSelect(user.type)">
          {{ user.type }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
/**
 * Dev-only component to select user type from the web UI, while auth is in development.
 * Purely a quality-of-life feature.
 */
export default {
  name: "UserSwitcher",
  props: {
    value: {
      type: String,
      required: false,
    }
  },
  data() {
    return {
      userTypes: [
        { type: 'admin', home: '/admin' },
        { type: 'client', home: '/client' },
        { type: 'volunteer', home: '/volunteer' },
        { type: 'service_requestor', home: '/org' },
      ],
    }
  },
  methods: {
    handleSelect(value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style scoped>
.user-switcher {
  position: fixed;
  top: 5px;
  left: 40%;
  z-index: 10;
  transition: left 0.5s;
}
.user-menu {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 6px 1px #ccd8ea;
}
.user-menu:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: springgreen;
}
</style>
