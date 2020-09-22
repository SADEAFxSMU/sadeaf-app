<template>
  <base-profile :user="user" :loading="$apollo.loading">
    <template v-slot:role-content>
      <div class="">
        <div class="volunteer-stats">
          <stat-card v-for="({value, color}, statName) in stats"
                     :title="statName"
                     title-position="bottom"
                     :stat="value"
                     :accent-color="color" />
        </div>
        <h1>Assignments</h1>
        <div class="assignments">
          <assignment-card v-for="assignment in assignments"
                           :details="assignment"
                           :show-edit="false"
                           type="elevate" />
        </div>
      </div>
    </template>
  </base-profile>
</template>

<script>
import gql from 'graphql-tag';
import BaseProfile from "./BaseProfile";
import StatCard from "../../StatCard";
import { accountFieldsFragment } from "../../../common/graphql/fragments";
import AssignmentCard from "../../cards/AssignmentCard";

const VolunteerQuery = gql`
  query VolunteerQueryByAccountId($id: Int!) {
    user: account_by_pk(id: $id){
      ...accountFields
      volunteer {
        id
        assignments {
          id
          event {
            id
            name
          }
          start_dt
          end_dt
          status
          address_line_one
          room_number
        }
      }
    }
  }
  ${accountFieldsFragment}
`;


export default {
  name: "VolunteerProfile",

  components: {
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
      stats: {
        "Attendance": {
          value: '100%',
          color: '#3dd670',
        },
        "Clients": {
          value: 21,
          color: '#3dd670',
        },
        Cancels: {
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
    assignments() {
      return this.volunteer.assignments;
    }
  },

  apollo: {
    user: {
      query: VolunteerQuery,
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
</style>
