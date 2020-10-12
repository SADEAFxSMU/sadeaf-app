<template>
  <div class="opt-in">
    <div :class="{ 'loading': true, 'appear': !loading }">
      <el-spinner />
    </div>
    <div class="opt-in-details">
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
import UserAvatar from "../user/UserAvatar";
import gql from "graphql-tag";

export default {
  name: "VolunteerAssignmentOptInCard",
  components: {UserAvatar},
  data() {
    return {
      loading: false,
    }
  },
  props: {
    optIn: {
      type: Object,
      required: false,
    }
  },

  methods: {
    async handleAcceptVolunteerOptIn(optIn) {
      this.loading = true;
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
        this.$message.success('Volunteer Successfully Allocated!');
      } else {
        console.error('Did not delete properly');
      }
      setTimeout(() => this.loading = false, 1000);
    },
    handleRejectVolunteerOptIn(optIn) {
      // Delete?
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
  background-color: rgba(255,255,255,0.3);
  backdrop-filter: blur(4px);
  border-radius: 4px;
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
