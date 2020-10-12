<template>
  <div class="container">
    <div class="opt-in-list" v-if="volunteerAssignmentOptIns.length > 0">
      <div v-for="optIn in volunteerAssignmentOptIns" :key="'opt-in-' + optIn.id" class="opt-in">
        <volunteer-assignment-opt-in-card :opt-in="optIn" loading="" />
      </div>
    </div>
    <no-data-placeholder class="placeholder" v-else />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import UserCard from './user/UserCard';
import UserAvatar from './user/UserAvatar';
import VolunteerAssignmentOptInCard from './cards/VolunteerAssignmentOptInCard';
import NoDataPlaceholder from './NoDataPlaceholder';

export default {
  name: 'VolunteerAssignmentOptInsList',
  components: { NoDataPlaceholder, VolunteerAssignmentOptInCard, UserAvatar, UserCard },
  data() {
    return {
      volunteerAssignmentOptIns: [],
    };
  },

  apollo: {
    $subscribe: {
      volunteerAssignmentOptIns: {
        query: gql`
          subscription {
            volunteer_assignment_opt_ins: volunteer_assignment_opt_in {
              id
              volunteer {
                id
                account {
                  id
                  name
                  profile_pic_url
                }
              }
              assignment {
                id
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
          }
        `,
        result({ data: { volunteer_assignment_opt_ins } }) {
          this.volunteerAssignmentOptIns = volunteer_assignment_opt_ins;
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
.opt-in-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.opt-in {
  margin: 8px;
  width: 400px;
}
</style>
