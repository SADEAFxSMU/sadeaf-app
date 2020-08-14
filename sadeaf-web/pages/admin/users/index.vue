<template>
  <div>
    <h1>Users Listing Page</h1>
    <code>Filter for: {{ userTypeFilter }}</code>
  </div>
</template>

<script>
export default {
  name: "users",
  computed: {
    userTypeFilter() {
      return this.$route.query.type;
    }
  }
};
</script>

<style scoped>

</style>
