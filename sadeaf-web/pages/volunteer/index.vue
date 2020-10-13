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

  data() {
    return {
      volunteer: null,
    };
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    userName() {
      return this.user.name;
    },
  },

  apollo: {
    volunteer: {
      query: gql`
        query VolunteerByAccountId($account_id: Int!) {
          volunteer(where: { account_id: { _eq: $account_id } }) {
            id
            account_id
          }
        }
      `,
      variables() {
        return {
          account_id: this.user.id,
        };
      },
      result({ data }) {
        this.volunteer = data.volunteer[0];
      },
    },
  },
};
</script>

<style scoped>
.page-title {
  margin-bottom: 8px;
}
</style>
