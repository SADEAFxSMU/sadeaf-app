<template>
  <div class="page">
    <div class="heading">
      <h1>Users Management</h1>
      <div class="user-role-select">
        <el-select v-model="selectedRoles" collapse-tags multiple>
          <el-option v-for="role in ROLES" :label="role" :value="role" :key="role + '-check'" />
        </el-select>
      </div>
      <div class="user-search">
        <user-search style="width: 300px" />
      </div>
    </div>
    <div class="users-list">
      <users-list :filter-roles="selectedRoles" />
    </div>
  </div>
</template>

<script>
import UsersList from '../../../components/user/UsersList';
import UserSearch from '../../../components/user/UserSearch';
import { ROLES } from '../../../common/types/constants';

export default {
  name: 'users',

  components: {
    UserSearch,
    UsersList,
  },

  data() {
    return {
      selectedRoles: [],
      ROLES,
    };
  },

  created() {
    this.setSelectedRolesFromUrlQuery(true);
  },

  methods: {
    setSelectedRolesFromUrlQuery(defaultToAllRoles = true) {
      let roles = [];
      const { type } = this.$route.query;
      if (type) {
        roles = type.split(',');
      } else if (type === 'all') {
        roles = Object.keys(ROLES);
      } else if (!type && defaultToAllRoles) {
        roles = Object.keys(ROLES);
      }
      this.selectedRoles = roles;
    },
  },

  computed: {
    userTypeFilter() {
      return this.$route.query.type;
    },
  },

  watch: {
    userTypeFilter(roles) {
      this.selectedRoles = roles;
      this.setSelectedRolesFromUrlQuery(false);
    },
    selectedRoles(selectedRoles) {
      let query = {};
      if (selectedRoles && selectedRoles.length > 0) {
        query = {
          type: selectedRoles.join(','),
        };
      }
      this.$router.push({
        path: this.$route.path,
        query,
      });
    },
  },
};
</script>

<style scoped>
.users-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}
.heading {
  display: flex;
  align-items: center;
}
.user-role-select {
  padding-left: 8px;
}
.user-search {
  padding-left: 8px;
}
</style>
