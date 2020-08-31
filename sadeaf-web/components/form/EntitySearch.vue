<template>
  <el-autocomplete
    v-model="search"
    :fetch-suggestions="querySearch"
    :placeholder="`Search ${schema}`"
    @select="handleSelect"
    popper-class="popper"
    style="width: 500px;"
  >
    <template slot-scope="{ item }">
      <slot :data="item">
        <pre>{{ JSON.stringify(item, null, 2) }}</pre>
      </slot>
    </template>
  </el-autocomplete>
</template>

<script>
import { buildGraphQLQuery } from '../../common/types/GraphqlCrudManager';
export default {
  name: "EntitySearch",
  props: {
    schema: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    }
  },

  data() {
    return {
      search: '',
      loading: false,
      entity: null
    }
  },

  methods: {
    querySearch(queryString, cb) {
      const schema = this.schema;
      const role = this.role;
      const query = buildGraphQLQuery({ schema, role });

      this.$apollo.query({ query })
        .then(result => {
          const data = result.data[schema];
          console.log(data, queryString);
          const filtered = data
            .filter(x => JSON.stringify(x).toLowerCase().includes(queryString.toLowerCase()));
          cb(filtered);
        });
    },
    handleSelect(item) {
      this.$emit('select', item);
    }
  },
};
</script>

<style scoped>
</style>
