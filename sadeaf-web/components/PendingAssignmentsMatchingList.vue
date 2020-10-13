<template>
  <div class="container">
    <div class="pending-assignment-list" v-if="pendingAssignments.length > 0">
      <div
        v-for="pendingAssignment in pendingAssignments"
        :key="'pa-' + pendingAssignment.id"
        class="pending-assignment"
      >
        <pending-assignment-volunteers-opt-in-card
          :pending-assignment="pendingAssignment"
          :recommended-volunteer-id="getRecommendedVolunteerId(pendingAssignment)"
        />
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
import { MATCHING_SERVICE } from '../config';

export default {
  name: 'PendingAssignmentsMatchingList',
  components: { NoDataPlaceholder, PendingAssignmentVolunteersOptInCard, UserAvatar, UserCard },
  data() {
    return {
      pendingAssignments: [],
      matchScoresByVolunteerId: {},
    };
  },

  created() {
    fetch(MATCHING_SERVICE.RECOMMENDATION_ENDPOINT + '?client_id=1')
      .then((response) => response.json())
      .then((result) => (this.matchScoresByVolunteerId = result))
      .catch((err) => console.error('Error occurred while querying recommendations', err));
  },

  methods: {
    getRecommendedVolunteerId(pendingAssignment) {
      try {
        const matchScoresByVolunteerId = this.matchScoresByVolunteerId;

        // Filter the matchScoresByVolunteerId object, include only those who opted in
        const { volunteer_assignment_opt_ins } = pendingAssignment;
        const optedInVolunteerIds = new Set(volunteer_assignment_opt_ins.map(({ volunteer }) => volunteer.id));
        const optedInVolunteerScores = _.pickBy(matchScoresByVolunteerId, (_, volunteerId) =>
          optedInVolunteerIds.has(Number.parseInt(volunteerId))
        );

        // Get the volunteer id with the max score
        let recommendedVolunteerId = null;
        let maxScore = -Infinity;
        _.forOwn(optedInVolunteerScores, (score, volunteerId) => {
          if (score > maxScore) {
            maxScore = score;
            recommendedVolunteerId = volunteerId;
          }
        });
        return Number.parseInt(recommendedVolunteerId);
      } catch (err) {
        console.error('Error occurred while working out recommended volunteer', err);
        return null;
      }
    },
  },

  apollo: {
    $subscribe: {
      volunteerAssignmentOptIns: {
        query: gql`
          subscription {
            pending_assignments: assignment(where: { status: { _eq: "PENDING" } }) {
              id
              start_dt
              end_dt
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
