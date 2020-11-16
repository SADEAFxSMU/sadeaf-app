<template>
  <div class="cal-container">
    <VolunteerEventCalendar v-if="volunteer" :volunteer="volunteer" />
  </div>
</template>

<script>
import VolunteerEventCalendar from '../../components/calendars/VolunteerEventCalendar';

export default {
  name: 'volunteer-home',

  components: {
    VolunteerEventCalendar,
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    userName() {
      return this.user.name;
    },
    volunteer() {
      return { account_id: this.$store.state.auth.user.id, ...this.$store.state.auth.user.volunteer };
    },
  },
};
</script>

<style scoped>
.page-title {
}
.cal-container {
  display: flex;
  justify-content: center;
}
</style>
