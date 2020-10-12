<template>
  <div class="opt-in-list">
    <div v-for="optIn in volunteerAssignmentOptIns" :key="'opt-in-' + optIn.id" class="opt-in">
      <user-avatar
        :profile-pic-url="optIn.volunteer.account.profile_pic_url"
        :name="optIn.volunteer.account.name"
        role="volunteer"
        class="user-avatar"
      />
      <user-avatar
        :profile-pic-url="optIn.assignment.event.client.account.profile_pic_url"
        :name="optIn.assignment.event.client.account.name"
        role="client"
      />
      <div class="event">
        <div class="event-details">
          <h4>{{ optIn.assignment.event.name }}</h4>
          <p>{{ optIn.assignment.event.description }}</p>
        </div>
        <el-button-group>
          <el-button icon="el-icon-check" size="mini" @click="handleAcceptVolunteerOptIn(optIn)" />
          <el-button icon="el-icon-close" size="mini" @click="handleRejectVolunteerOptIn(optIn)" />
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import UserCard from './user/UserCard';
import UserAvatar from './user/UserAvatar';

export default {
  name: 'VolunteerAssignmentOptInsList',
  components: { UserAvatar, UserCard },
  data() {
    return {
      volunteerAssignmentOptIns: [],
    };
  },

  methods: {
    async handleAcceptVolunteerOptIn(optIn) {
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
          assignment_id: optIn.assignment.id,
          volunteer_id: optIn.volunteer.id,
          opt_in_id: optIn.id,
        },
      });

      if (update.id === optIn.assignment.id && del.id === optIn.id) {
        this.$notify.success({ title: 'Volunteer Successfully Allocated!', message: '' });
      } else {
        console.error('Did not delete properly');
      }
    },
    handleRejectVolunteerOptIn(optIn) {
      // Delete?
    },
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
.opt-in-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.opt-in {
  margin: 8px;
  padding: 8px;
  background-color: #f4f5ff;
  border-radius: 4px;
  width: 400px;
}
.event {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 1px 1px 6px 1px #d7daf1;
}
.event-details {
  width: 100%;
  padding: 8px;
}
.user-avatar {
  margin: 12px;
}
</style>
