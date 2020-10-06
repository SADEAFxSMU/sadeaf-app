<template>
  <BlacklistVolunteerCard
    v-if="this.volunteers.length > 0"
    :volunteers="this.volunteers"
  />
</template>

<script>
import BlacklistVolunteerCard from '@/components/cards/BlacklistVolunteerCard';
import gql from 'graphql-tag';

const CLIENT_VOLUNTEER_QUERY = gql`query MyQuery($client_id: Int!) {
  assignment(where: {event: {client_id: {_eq: $client_id}}}, distinct_on: volunteer_id) {
    volunteer {
      id
      account {
        contact
        email
        id
        name
        profile_pic_url
      }
    }
  }
}
`;
export default {
  name: 'blacklist',
  components: { BlacklistVolunteerCard },
  data() {
    return {
      volunteers: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    if (this.user.role === 'client') {
      this.$apollo.query({
        query: CLIENT_VOLUNTEER_QUERY,
        variables: {
          client_id: this.user.client.id,
        },
      }).then(({ data }) => {
        this.volunteers = data.assignment.map( v => v.volunteer );
      });
    }
  }
};
</script>

<style scoped>

</style>
