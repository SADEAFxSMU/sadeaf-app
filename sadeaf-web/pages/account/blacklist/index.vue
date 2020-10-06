<template>
  <div class="blacklist-container-padding">
    <el-row
      class="margin-bottom__md"
      type="flex"
      justify="center"
      align="middle"
    >
      <el-input style="width: 50%" v-model="searchBlock" placeholder="Type to search for Volunteers" />
    </el-row>

    <BlacklistVolunteerCard
      v-for="volunteer in filteredVolunteers"
      :key="volunteer.id + 'blacklistCard'"
      :volunteer="volunteer"
      class="margin-bottom__md"
    />

    <client-blacklist-dialog :visible="viewMoreVisible"></client-blacklist-dialog>
  </div>
</template>

<script>
import BlacklistVolunteerCard from '@/components/cards/BlacklistVolunteerCard/index';
import gql from 'graphql-tag';
import ClientBlacklistDialog from '@/components/dialogs/ClientBlacklistDialog';


// TODO: Should we create a trigger for blacklist, on blacklist, remove all client assignments that have that volunteer assigned
// TODO: Make this subscription before for unblock list as well. Currently set to volunteer id not in black_list volutneer id for this client
const CLIENT_VOLUNTEER_SUB = gql`subscription sub($client_acc_id: Int!) {
  assignment(where: {event: {client: {account_id: {_eq: $client_acc_id}}, assignments: {status: {_eq: "COMPLETE"}}}, volunteer: {_not: {blacklists: {client_account_id: {_eq: $client_acc_id}}}}}, distinct_on: volunteer_id) {
    volunteer {
      id
      account {
        contact
        email
        id
        profile_pic_url
        name
      }
      assignments(where: {event: {client: {account_id: {_eq: $client_acc_id}}}, status: {_eq: "COMPLETE"}}, order_by: {start_dt: desc}) {
        id
        status
        start_dt
        event {
          name
          id
          description
        }
      }
    }
  }
}
`;
export default {
  name: 'blacklist',
  components: { ClientBlacklistDialog, BlacklistVolunteerCard },
  data() {
    return {
      volunteers: [],
      searchBlock: '',
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    viewMoreVisible() {
      return this.$store.state.clientBlacklist.visible;
    },
    filteredVolunteers() {
      return this.volunteers.filter((v) => {
        if (!this.searchBlock) return true;
        const searchString = this.searchBlock.toLowerCase();
        return v.volunteerName.toLowerCase().includes(searchString) || v.eventNames.some((e) => e.indexOf(searchString) >= 0);
      });
    },
  },
  apollo: {
    $subscribe: {
      volunteers: {
        query: CLIENT_VOLUNTEER_SUB,
        variables() {
          return { client_acc_id: this.user.id };
        },
        result({ data }) {
          this.volunteers = data.assignment.map(v => ({
            ...v.volunteer,
            volunteerName: v.volunteer.account.name,
            eventNames: v.volunteer.assignments.map(a => a.event.name.toLowerCase()),
          }));
        },
      },
    },
  },
};
</script>

<style scoped>
.blacklist-container-padding {
  padding-left: 200px;
  padding-right: 200px;
}

.margin-bottom__md {
  margin-bottom: 16px;
}
</style>
