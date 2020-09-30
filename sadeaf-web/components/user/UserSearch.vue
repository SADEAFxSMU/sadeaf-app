<template>
  <div style="position: relative;">
    <el-input v-model="search"
              placeholder="Search user"
              prefix-icon="el-icon-search"
              @focus.passive="setVisible(true)"
              @blur.passive="setVisible(false)"
              v-on="$listeners" />
    <div class="search-results" :style="resultsStyle">
      <el-spinner v-if="loading" :radius="50" />
      <div v-else-if="results.length === 0">
        <code>No results</code>
      </div>
      <div class="user-card" v-else v-for="user in results" @click="onSelectUser(user)">
        <user-card-horizontal-small :user="user"/>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'debounce';
import UserCardHorizontalSmall from "./UserCardHorizontalSmall";
import gql from "graphql-tag";

export default {
  name: "UserSearch",
  components: {UserCardHorizontalSmall},
  props: {
    userRole: {
      type: String,
      required: true,
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
    onSearch() {
      this.$apollo.query({
        query: gql`query UserQuery($search: String!, $role: String!) {
          account(where: {
            _and: [
              { role: { _eq: $role } },
              {
                _or: [
                  { name: { _like: $search } }
                  { email: { _like: $search } }
                ]
              }
            ]
          }) {
            id
            name
            email
            client { id }
            volunteer { id }
            service_requestor { id }
          }
        }`,
        variables: {
          role: this.userRole,
          search: this.search + '%',
        }
      })
      .then(result => {
        this.results = result.data.account;
        this.loading = result.loading;
      })
    },
    onSelectUser(user) {
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
