<template>
  <el-autocomplete v-model="search"
                   :fetch-suggestions="querySearch"
                   style="width: 100%"
                   placeholder="Enter a name, email, ..."
                   @select="handleSelect">
    <i class="el-icon-search" slot="prepend" />
    <template v-slot="{ item }">
      <user-profile-link :user="item">
        <user-card-horizontal-small :user="item" />
      </user-profile-link>
    </template>
  </el-autocomplete>
</template>


<script>
import debounce from 'debounce';
import UserCardHorizontalSmall from "./UserCardHorizontalSmall";
import gql from "graphql-tag";
import UserProfileLink from "../link/UserProfileLink";
import { accountFieldsWithRolesFragment } from "../../common/graphql/fragments";

const UserSearchWithRoleQuery = gql`
  query UserSearchWithRoleQuery($search: String!, $role: String!) {
    users: account(where: {
      _and: [
        { role: { _eq: $role } },
        {
          _or: [
            { username: { _like: $search } }
            { name: { _like: $search } }
            { email: { _like: $search } }
          ]
        }
      ]
    }) {
      ...accountFieldsWithRoles
    }
  }
  ${accountFieldsWithRolesFragment}
`;

const UserSearchQuery = gql`
  query UserSearchQuery($search: String!) {
    users: account(where: {
      _or: [
        { username: { _like: $search } }
        { name: { _like: $search } }
        { email: { _like: $search } }
      ]
    }) {
      ...accountFieldsWithRoles
    }
  }
  ${accountFieldsWithRolesFragment}
`;

export default {
  name: "UserSearch",

  components: {
    UserProfileLink,
    UserCardHorizontalSmall
  },

  props: {
    userRole: {
      type: String,
      required: false,
    },
    clickToProfile: {
      type: Boolean,
      required: false,
      default: false,
    }
  },

  data() {
    return {
      search: "",
      results: [],
      loading: false,
      visible: false,
    }
  },

  created() {
    this.onSearch = debounce(this.onSearch, 300);
  },

  methods: {
    async querySearch(queryString, cb) {
      let result;
      this.loading = true;
      if (this.userRole) {
        result = await this.$apollo.query({
          query: UserSearchWithRoleQuery,
          variables: {
            role: this.userRole,
            search: this.search + '%',
          }
        });
      } else {
        result = await this.$apollo.query({
          query: UserSearchQuery,
          variables: {
            search: this.search + '%',
          }
        });
      }
      this.loading = true;
      const users = result.data.users;
      cb(users.map(user => ({ ...user, value: user.name })));
    },

    handleSelect(user) {
      this.$emit('select', user);
    },

    setVisible(visible) {
      this.visible = visible;
    }
  },

  computed: {
    resultsStyle() {
      const height = this.visible ? Math.max(this.results.length * 60, 60) + 'px' : 0;
      const border = this.visible ? null : 'none';
      return { height, border };
    }
  },
  watch: {
    search(val) {
      if (val) {
        this.loading = true;
        this.onSearch();
      } else {
        this.results = [];
      }
    }
  }
};
</script>

<style scoped>
.search-results {
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 1;
  background: white;
  border: 1px solid lightgrey;
  border-top: none;
  border-radius: 4px;
  width: 100%;
  overflow: scroll;
  max-height: 400px;
  transition: height 0.2s;
}
.search-results > * {
  padding: 10px;
}
.user-card {
  transition: background 0.2s;
  padding: 10px;
}
.user-card:hover {
  background: lightskyblue;
  cursor: pointer;
}
</style>
