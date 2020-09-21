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
    userName() {
      return this.$store.state.auth.user.volunteer.account.name;
    }
  }
};
</script>

<style scoped>
  .page-title {
    margin-bottom: 8px;
  }
</style>
