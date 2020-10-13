<template>
  <div class="opt-in">
    <div :class="{ loading: true, appear: !loading }">
      <el-spinner />
    </div>
    <div class="opt-in-details">
      <div>
        <user-avatar
          :profile-pic-url="pendingAssignment.event.client.account.profile_pic_url"
          :name="pendingAssignment.event.client.account.name"
          role="client"
        />
        <div class="event">
          <div class="event-details">
            <h4>{{ pendingAssignment.event.name }}</h4>
            <el-divider> Details </el-divider>
            <table>
              <tr>
                <th>Start</th>
                <td>{{ startDatetime }}</td>
              </tr>
              <tr>
                <th>End</th>
                <td>{{ endDatetime }}</td>
              </tr>
              <tr>
                <th>Desc.</th>
                <td>{{ pendingAssignment.event.description }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="select-container">
        <el-select
          :value="selectedVolunteer && selectedVolunteer.account.name"
          @change="handleSelectVolunteerOptIn"
          no-data-text="No volunteers yet"
          style="flex: 1; margin-right: 8px"
        >
          <el-option
            v-for="volunteerOptIn in pendingAssignment.volunteer_assignment_opt_ins"
            :key="'opt-in-' + pendingAssignment.id + '-v-' + volunteerOptIn.volunteer.id"
            class="option"
            :label="volunteerOptIn.volunteer.account.name"
            :value="volunteerOptIn"
          >
            <user-avatar
              :profile-pic-url="volunteerOptIn.volunteer.account.profile_pic_url"
              :name="volunteerOptIn.volunteer.account.name"
              role="volunteer"
              :class="{ 'user-avatar': true, primary: volunteerOptIn.volunteer.id === recommendedVolunteerId }"
            />
          </el-option>
        </el-select>
        <el-button type="success" @click="handleAcceptVolunteerOptIn" :disabled="selectedVolunteerOptIn === null">
          Confirm
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from '../user/UserAvatar';
import gql from 'graphql-tag';
import { DateUtils } from '../../common/date-utils';

export default {
  name: 'PendingAssignmentVolunteersOptInCard',
  components: { UserAvatar },

  props: {
    pendingAssignment: {
      type: Object,
      required: false,
    },
    recommendedVolunteerId: {
      type: Number,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      loading: false,
      selectedVolunteerOptIn: null,
    };
  },

  created() {
    const recommendedVolunteerId = this.recommendedVolunteerId;
    this.setRecommendedVolunteer(recommendedVolunteerId);
  },

  methods: {
    handleSelectVolunteerOptIn(volunteerOptIn) {
      this.selectedVolunteerOptIn = volunteerOptIn;
    },
    async handleAcceptVolunteerOptIn() {
      this.loading = true;

      const pendingAssignment = this.pendingAssignment;
      const optIn = this.selectedVolunteerOptIn;

      const {
        data: { update, del },
      } = await this.$apollo.mutate({
        mutation: gql`
          mutation AssignVolunteerToAssignment($assignment_id: Int!, $volunteer_id: Int!, $opt_in_id: Int!) {
            update: update_assignment_by_pk(
              pk_columns: { id: $assignment_id }
              _set: { volunteer_id: $volunteer_id, status: "MATCHED" }
            ) {
              id
            }

            del: delete_volunteer_assignment_opt_in_by_pk(id: $opt_in_id) {
              id
            }
          }
        `,
        variables: {
          assignment_id: pendingAssignment.id,
          volunteer_id: optIn.volunteer.id,
          opt_in_id: optIn.id,
        },
      });

      if (update.id === pendingAssignment.id && del.id === optIn.id) {
        this.$message.success('Volunteer Successfully Allocated!');
      } else {
        console.error('Did not delete properly');
      }
      setTimeout(() => (this.loading = false), 500);
    },

    handleRejectVolunteerOptIn() {
      // Delete?
    },

    setRecommendedVolunteer(recommendedVolunteerId) {
      if (recommendedVolunteerId) {
        for (const volunteerOptIn of this.pendingAssignment.volunteer_assignment_opt_ins) {
          if (volunteerOptIn.volunteer.id === recommendedVolunteerId) {
            this.selectedVolunteerOptIn = volunteerOptIn;
          }
        }
      }
    },
  },
  computed: {
    selectedVolunteer() {
      return this.selectedVolunteerOptIn && this.selectedVolunteerOptIn.volunteer;
    },
    startDatetime() {
      return DateUtils.humanReadableDt(this.pendingAssignment.start_dt);
    },
    endDatetime() {
      return DateUtils.humanReadableDt(this.pendingAssignment.end_dt);
    },
  },

  watch: {
    recommendedVolunteerId(val) {
      this.setRecommendedVolunteer(val);
    },
  },
};
</script>

<style scoped>
.opt-in {
  position: relative;
  background-color: #f4f5ff;
  border-radius: 4px;
}
.opt-in-details {
  padding: 8px;
}
.loading {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  z-index: 10;
}
.loading.appear {
  display: none;
}
.event {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px;
  margin: 8px;
}
.event-details {
  width: 100%;
  padding: 8px;
}
.user-avatar {
  position: relative;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
}
.primary {
  background: #d8f8de;
}
.select-container {
  display: flex;
  padding: 0 8px 0 8px;
}
.option {
  height: 80px;
  display: flex;
  align-items: center;
}
.event-details {
  color: #5f5f75;
}
.event-details th {
  text-align: right;
}
.event-details td {
  padding: 4px 4px 4px 8px;
}
</style>
