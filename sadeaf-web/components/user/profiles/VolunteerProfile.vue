<template>
  <base-profile :user="user" :loading="$apollo.loading">
    <template v-slot:role-content>
      <div class="volunteer-stats">
        <stat-card v-for="({value, color}, statName) in stats"
                   :title="statName"
                   title-position="bottom"
                   :stat="value"
                   :accent-color="color" />
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

const VolunteerQuery = gql`
  query VolunteerQueryByAccountId($id: Int!) {
    user: account_by_pk(id: $id){
      ...accountFields

      volunteer {
        id
      }
    }

    unique_clients: client_aggregate(where: {events:{assignments:{volunteer:{account_id:{_eq:$id}}}}}) {
      aggregate {
        count
      }
    }

    events: event(where: {assignments:{volunteer:{account_id:{_eq: $id}}}}) {
      id
      name
      client {
        id
        account {
          id
          name
          profile_pic_url
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
`;


export default {
  name: "VolunteerProfile",

  components: {
    VolunteerEventsTable,
    AssignmentCard,
    StatCard,
    BaseProfile
  },

  props: {
    userId: {
      type: [String, Number],
      required: true,
    }
  },

  data() {
    return {
      user: null,
      events: [],
      attendance_aggregate: null,
      stats: {
        attendance: {
          value: '100%',
          color: '#3dd670',
        },
        clients: {
          value: 21,
          color: '#3dd670',
        },
        cancels: {
          value: '68%',
          color: 'salmon',
        },
      }
    }
  },

  computed: {
    volunteer() {
      return this.user.volunteer;
    },
  },

  apollo: {
    user: {
      query: VolunteerQuery,
      result({ data }) {
        const {
          user,
          unique_clients,
          events,
          attendance_aggregate,
          attended_count,
          not_attended_count
        } = data;
        this.user = user;
        this.events = events;
        this.attendance_aggregate = attendance_aggregate;
        this.stats.clients.value = unique_clients.aggregate.count;
        this.stats.attendance.value = (
          attended_count.aggregate.count /
          (attended_count.aggregate.count + not_attended_count.aggregate.count)
        ) * 100 + '%';
      },
      variables() {
        return {
          id: this.userId,
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
