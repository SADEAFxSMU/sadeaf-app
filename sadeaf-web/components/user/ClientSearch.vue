<template>
  <el-autocomplete v-model="search"
                   :fetch-suggestions="querySearch"
                   style="width: 100%"
                   placeholder="Enter a name, email, ..."
                   @select="handleSelect">
    <i class="el-icon-search" slot="prepend" />
    <template v-slot="{ item }">
      <user-card-horizontal-small :user="item.account" />
    </template>
  </el-autocomplete>
</template>

<script>
import debounce from 'debounce';
import gql from 'graphql-tag';
import UserCardHorizontalSmall from "./UserCardHorizontalSmall";
export default {
  name: "ClientSearch",
  components: {UserCardHorizontalSmall},
  data() {
    return {
      results: [],
      search: ''
    };
  },
  created() {
    this.querySearch = debounce(this.querySearch, 300);
  },
  methods: {
    async querySearch(queryString, cb) {
      const { data } = await this.$apollo.query({
        query: gql`query ClientQuery($search: String!) {
        clients: client(where: {
          _or: [
            {account: {name: {_like: $search}}},
            {account: {email: {_like: $search}}}
          ]
        }) {
          id
          account { id, name, email }
        }
      }`,
        variables: {
          search: '%' + this.search + '%',
        }
      });
      cb(data.clients.map(client => ({ ...client, value: client.account.name })));
    },
    handleSelect(client) {
      this.$emit('select', client);
    }
  },
};
</script>

<style scoped>

</style>
