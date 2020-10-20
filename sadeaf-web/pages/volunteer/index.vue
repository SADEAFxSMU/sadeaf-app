<template>
  <div>
    <h1 class="page-title">Welcome Back, {{ userName }}</h1>
    <VolunteerEventCalendar v-if="volunteer" :volunteer="volunteer" />
  </div>
</template>

<script>
import gql from 'graphql-tag';
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
  margin-bottom: 8px;
}
</style>
