<template>
  <div class="profile-page">
    <volunteer-profile :user-id="id" />
  </div>
</template>

<script>
import VolunteerProfile from '../../components/user/profiles/VolunteerProfile';

export default {
  name: 'volunteer-profile-page',

  components: {
    VolunteerProfile,
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
