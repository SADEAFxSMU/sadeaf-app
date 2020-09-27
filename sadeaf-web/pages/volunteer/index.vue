<template>
  <div>
    <h1 class="page-title">Welcome Back, {{ userName }}</h1>
    <VolunteerEventCalendar />
  </div>
</template>

<script>
import VolunteerEventCalendar from "../../components/calendars/VolunteerEventCalendar";
export default {
  name: "volunteer-home",
  components: {VolunteerEventCalendar},
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    volunteer() {
      return this.user.volunteer;
    },
    userName() {
      return this.user.name;
    },
  }
};
</script>

<style scoped>
  .page-title {
    margin-bottom: 8px;
  }
</style>
