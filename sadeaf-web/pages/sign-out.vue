<!--suppress JSUnresolvedVariable -->

<template>
  <div />
</template>

<script>
export default {
  mounted() {
    this.$auth.signOut().finally(() => {
      this.$router.push({ path: '/sign-in' });
    });
  },
};
</script>
