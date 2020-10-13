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
            <p>{{ pendingAssignment.event.description }}</p>
          </div>
        </div>
      </div>
      <div class="select-container">
        <el-select :value="selectedVolunteer && selectedVolunteer.account.name" @change="handleSelectVolunteerOptIn" style="flex: 1; margin-right: 8px;">
          <el-option v-for="volunteerOptIn in pendingAssignment.volunteer_assignment_opt_ins"
                     :key="'opt-in-' + pendingAssignment.id + '-v-' + volunteerOptIn.volunteer.id"
                     class="option"
                     :label="volunteerOptIn.volunteer.account.name"
                     :value="volunteerOptIn">
            <user-avatar
              :profile-pic-url="volunteerOptIn.volunteer.account.profile_pic_url"
              :name="volunteerOptIn.volunteer.account.name"
              role="volunteer"
              class="user-avatar"
            />
          </el-option>
        </el-select>
        <el-button type="success" @click="handleAcceptVolunteerOptIn">
          Confirm
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from '../user/UserAvatar';
import gql from 'graphql-tag';

export default {
  name: 'PendingAssignmentVolunteersOptInCard',
  components: { UserAvatar },

  data() {
    return {
      loading: false,
      selectedVolunteerOptIn: null,
    };
  },

  props: {
    pendingAssignment: {
      type: Object,
      required: false,
    },
  },

  methods: {
    handleSelectVolunteerOptIn(volunteerOptIn) {
      this.selectedVolunteerOptIn = volunteerOptIn;
    },
    async handleAcceptVolunteerOptIn() {
      this.loading = true;

      const pendingAssignment = this.pendingAssignment;
      const optIn = this.selectedVolunteerOptIn;

      console.log(optIn);

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
  },
  computed: {
    selectedVolunteer() {
      return this.selectedVolunteerOptIn && this.selectedVolunteerOptIn.volunteer;
    }
  }
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
  height: 50px;
}
.select-container {
  display: flex;
  padding: 0 8px 0 8px;
}
.option {
  height: 65px;
  display: flex;
  align-items: center;
}
</style>
