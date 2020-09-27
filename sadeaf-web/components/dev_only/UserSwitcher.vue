<template>
  <div class="user-switcher">
    <el-menu default-active="/admin" router class="user-menu">
      <el-submenu index="">
        <template v-slot:title>
          <div>
            <el-icon name="user" /> {{ userType }}
          </div>
        </template>
        <el-menu-item v-for="user in userTypes"
                      :key="'user-' + user.type"
                      :index="user.home"
                      @click="handleSelect(user)">
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
  data() {
    return {
      userTypes: [
        {
          type: 'admin',
          home: '/admin',
          user: {
            id: 1,
            name: 'Admin Guy',
            email: 'admin@gmail.com',
            userType: 'admin',
            admin: {
              id: 1,
            }
          }
        },
        {
          type: 'client',
          home: '/client',
          user: {
            id: 6,
            name: 'Jon Lee',
            email: 'jonlee@gmail.com',
            userType: 'client',
            client: {
              id: 1,
            }
          }
        },
        {
          type: 'volunteer',
          home: '/volunteer',
          user: {
            id: 17,
            name: 'Wayne Toh',
            email: 'waynetoh@gmail.com',
            userType: 'volunteer',
            volunteer: {
              id: 1,
            },
          }
        },
        {
          type: 'service_requestor',
          home: '/org',
          user: {
            id: 2,
            name: 'Donny Yen',
            email: 'donnyyen@gmail.com',
            userType: 'service_requestor',
            service_requestor: {
              id: 1,
            },
          }
        },
      ],
    }
  },
  methods: {
    handleSelect(value) {
      const { type, user } = value;
      this.$store.commit('auth/setUser', {
        userType: type,
        user,
      });
      this.$apolloHelpers.restartWebsockets();
    }
  },
  computed: {
    userType() {
      const { user } = this.$store.state.auth;
      return user && user.userType;
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
