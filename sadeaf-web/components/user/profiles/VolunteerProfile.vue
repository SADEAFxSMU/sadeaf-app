<template>
  <base-profile :user="user" :loading="$apollo.loading">
    <template v-slot:role-content>
      <div class="volunteer-stats">
        <stat-card
          v-for="({value, color}, statName) in stats"
          style="flex: 1;"
          :title="statName"
          title-position="bottom"
          :stat="value"
          :accent-color="color"
        />
      </div>
      <div>
        <stat-bar :stats="percentageStats" />
      </div>
    </template>

    <template v-slot:role-body>
      <volunteer-events-table :events="events" />
    </template>
  </base-profile>
</template>

<script>
import gql from 'graphql-tag';
import BaseProfile from "./BaseProfile";
import StatCard from "../../StatCard";
import { accountFieldsFragment } from "../../../common/graphql/fragments";
import AssignmentCard from "../../cards/AssignmentCard";
import VolunteerEventsTable from "../../tables/VolunteerEventsTable/index";
import StatBar from "../../indicators/StatBar";

const statCardColor = '#97baff';

export default {
  name: 'VolunteerProfile',

  components: {
    StatBar,
    VolunteerEventsTable,
    AssignmentCard,
    StatCard,
    BaseProfile,
  },

  props: {
    volunteerId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      volunteer: null,
      events: [],
      attendance_aggregate: null,
      percentageStats: {
        attendance: {
          label: 'attendance',
          percentage: 100,
        },
        cancellations: {
          label: 'cancellations',
          percentage: 20,
          color: '#3dd670',
        }
      },
      stats: {
        completed: {
          label: 'completed',
          value: 0,
          color: statCardColor,
        },
        inprogress: {
          label: 'in progress',
          value: 0,
          color: statCardColor,
        },
        clients: {
          value: 21,
          color: statCardColor,
        },
      },
    };
  },

  computed: {
    user() {
      return this.volunteer && this.volunteer.user;
    },
  },

  apollo: {
    volunteer: {
      query: gql`
        query VolunteerQueryByAccountId($id: Int!) {
          volunteer: volunteer_by_pk(id: $id) {
            id
            user: account {
              ...accountFields
            }
          }

          events: event(where: {assignments:{volunteer_id:{_eq: $id}}}) {
            id
            name
            client {
              id
              account {
                id
                name
                profile_pic_url
                email
                created_at
              }
            }
            statuses: assignments_aggregate(distinct_on: status) {
              nodes {
                status
              }
            }
            assignments {
              id
              start_dt
              end_dt
              status
              address_line_one
              room_number
              attendance {
                id
                attended
              }
            }
          }

          unique_clients: client_aggregate(where: {events:{assignments:{volunteer_id:{_eq:$id}}}}) {
            aggregate {
              count
            }
          }

          attended_count: attendance_aggregate(where: { attended: { _eq: true }}) {
            aggregate {
              count
            }
          }
          not_attended_count: attendance_aggregate(where: {attended: {_eq: false}}) {
            aggregate {
              count
            }
          }
        }
        ${accountFieldsFragment}
      `,
      result({ data }) {
        const {
          volunteer,
          unique_clients,
          events,
          attendance_aggregate,
          attended_count,
          not_attended_count
        } = data;
        this.volunteer = volunteer;
        this.events = events;
        this.attendance_aggregate = attendance_aggregate;
        this.stats.clients.value = unique_clients.aggregate.count;
        this.percentageStats.attendance.value = (
          attended_count.aggregate.count /
          (attended_count.aggregate.count + not_attended_count.aggregate.count)
        ) * 100;
      },
      variables() {
        return {
          id: this.volunteerId,
        }
      }
    }
  },
};
</script>

<style scoped>
.volunteer {
}
.volunteer-stats {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.assignments {
  width: 100%;
}
.heading {
  margin-top: 16px;
  text-align: center;
}
</style>
