<template>
  <div class="container">
    <div class="pending-assignment-list" v-if="pendingAssignments.length > 0">
      <div v-for="pendingAssignment in pendingAssignments" :key="'pa-' + pendingAssignment.id" class="pending-assignment">
         <pending-assignment-volunteers-opt-in-card :pending-assignment="pendingAssignment" />
      </div>
    </div>
    <no-data-placeholder class="placeholder" v-else />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import UserCard from './user/UserCard';
import UserAvatar from './user/UserAvatar';
import PendingAssignmentVolunteersOptInCard from './cards/PendingAssignmentVolunteersOptInCard';
import NoDataPlaceholder from './NoDataPlaceholder';

export default {
  name: 'PendingAssignmentsMatchingList',
  components: { NoDataPlaceholder, PendingAssignmentVolunteersOptInCard, UserAvatar, UserCard },
  data() {
    return {
      pendingAssignments: [],
    };
  },

  apollo: {
    $subscribe: {
      volunteerAssignmentOptIns: {
        query: gql`
          subscription {
            pending_assignments: assignment(where: { status: { _eq: "PENDING" }}) {
              id
              volunteer_assignment_opt_ins {
                id
                volunteer {
                  id
                  account {
                    id
                    name
                    profile_pic_url
                  }
                }
              }
              event {
                id
                name
                description
                client {
                  id
                  account {
                    id
                    name
                    profile_pic_url
                  }
                }
              }
            }
          }
        `,
        result({ data: { pending_assignments } }) {
          this.pendingAssignments = pending_assignments;
        },
      },
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}
.pending-assignment-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pending-assignment {
  margin: 8px;
  width: 400px;
}
</style>
