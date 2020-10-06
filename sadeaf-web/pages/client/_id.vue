<template>
  <div class="profile-page">
    <client-profile :client-id="id" />
  </div>
</template>

<script>
import ClientProfile from "../../components/user/profiles/ClientProfile";

export default {
  name: "client-profile-page",

  components: {
    ClientProfile
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
  }
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
