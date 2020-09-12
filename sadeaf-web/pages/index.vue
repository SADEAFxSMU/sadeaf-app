<template>
  <div>
    <h1>App Home Page</h1>
    <p>Based on user's <code>type</code>, redirect to appropriate home page.</p>
    <p>For now, redirecting to /admin in 3 secs...</p>
  </div>
</template>

<script>
export default {
  name: "app-home",
  middleware: ['authz'],
  asyncData(ctx) {

  },
  mounted() {
    setTimeout(() => {
      this.$router.push('/admin');
    }, 3000);
  }
}
</script>

<style>

</style>
