<template>
  <div class="profile-page">
    <service-requestor-profile :user-id="id" />
  </div>
</template>

<script>
import ServiceRequestorProfile from '../../components/user/profiles/ServiceRequestorProfile';

export default {
  name: 'service-requestor-profile-page',

  components: {
    ServiceRequestorProfile,
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
