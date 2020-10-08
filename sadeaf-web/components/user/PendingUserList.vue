<template>
  <div>
    <div>
      <user-card
        v-for="user in pendingUsers"
        :key="'user-' + user.id"
        :link-to-page="false"
        :clickable="false"
        :user="user"
        class="user-card"
      >
        <template v-slot:footer>
          <div>
            <el-button type="danger" @click="handleReject(user)">Reject</el-button>
            <span class="button-divider"> or </span>
            <el-select placeholder="Accept As" v-model="selectedRoleByUserId[user.id]">
              <el-option v-for="role in ROLES" :label="'Accept as ' + role" :value="role">
                {{ role }}
              </el-option>
            </el-select>
            <el-button
              v-if="selectedRoleByUserId[user.id]"
              :loading="confirmButtonLoadingByUserId[user.id]"
              type="success"
              @click="handleApprove(user)"
            >
              Confirm
            </el-button>
          </div>
        </template>
      </user-card>
    </div>
    <el-dialog
      title="Delete User"
      :visible="deleteUserDialogVisible"
      @close="deleteUserDialogVisible = false"
      @closed="userToDelete = null"
    >
      <div v-if="userToDelete">
        <div class="delete-user-info">
          <h1>{{ userToDelete.name }}</h1>
          <h3>{{ userToDelete.email }}</h3>
          <p>Registered on {{ humanReadableDt(userToDelete.created_at) }}</p>
        </div>
        <danger-zone>
          <p>
            <strong>Warning:</strong>
            Rejecting the new user is permanent and cannot be undone.
          </p>
          <br />
          <el-button
            type="danger"
            style="width: 100%"
            size="mini"
            :loading="deleteUserButtonLoading"
            @click="handleConfirmDeleteUser(userToDelete)"
          >
            Confirm Rejection
          </el-button>
        </danger-zone>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { accountFieldsFragment } from '../../common/graphql/fragments';
import UserCard from '../../components/user/UserCard';
import { ROLES } from '../../common/types/constants';
import { DateUtils } from '../../common/date-utils';
import DangerZone from '../../components/forms/DangerZone';

const { humanReadableDt } = DateUtils;

export default {
  name: 'PendingUserList',

  components: {
    DangerZone,
    UserCard,
  },

  data() {
    return {
      pendingUsers: [],
      selectedRoleByUserId: {},
      confirmButtonLoadingByUserId: {},
      deleteUserDialogVisible: false,
      deleteUserButtonLoading: false,
      userToDelete: null,
      ROLES,
    };
  },

  methods: {
    humanReadableDt,

    async handleApprove(user) {
      this.confirmButtonLoadingByUserId[user.id] = true;
      try {
        await this.graphqlOnboardUser(user);
        this.confirmButtonLoadingByUserId[user.id] = false;
        this.$notify.success({
          title: `Successfully on-boarded ${user.name}`,
          message: `${user.name} (user id: ${user.id}) has been on-boarded as a ${this.selectedRoleByUserId[user.id]}!`,
          duration: 5000,
        });
      } catch (err) {
        console.error(err);
        this.confirmButtonLoadingByUserId[user.id] = false;
        this.$notify.error({
          title: 'Update Error',
          message: `Something went wrong while attempting to update User "${user.name}" (user id: ${user.id})`,
        });
      }
    },

    handleReject(user) {
      this.userToDelete = user;
      this.deleteUserDialogVisible = true;
    },

    async handleConfirmDeleteUser(user) {
      this.deleteUserButtonLoading = true;
      try {
        await this.graphqlDeleteUser(user);
        this.deleteUserButtonLoading = false;
        this.deleteUserDialogVisible = false;
        this.$notify.success({
          title: `Rejected user ${user.name}`,
          message: `User "${user.name}" has been removed from the database`,
        });
      } catch (err) {
        console.error(err);
        this.deleteUserButtonLoading = false;
        this.$notify.error({
          title: 'Delete Error',
          message: `Something went wrong while attempting to delete User "${user.name}"`,
        });
      }
    },

    graphqlOnboardUser(user) {
      const id = user.id;
      const role = this.selectedRoleByUserId[id];
      switch (role) {
        case ROLES.admin:
          return this.$apollo.mutate({
            mutation: gql`
              mutation InsertAdmin($account_id: Int!) {
                insert_admin_one(object: { account_id: $account_id }) {
                  id
                }
                update_account_by_pk(pk_columns: { id: $account_id }, _set: { role: "admin" }) {
                  id
                  role
                }
              }
            `,
            variables: {
              account_id: id,
            },
          });

        case ROLES.volunteer:
          return this.$apollo.mutate({
            mutation: gql`
              mutation InsertVolunteer($account_id: Int!) {
                insert_volunteer_one(object: { account_id: $account_id, approval_status: true }) {
                  id
                }
                update_account_by_pk(pk_columns: { id: $account_id }, _set: { role: "volunteer" }) {
                  id
                  role
                }
              }
            `,
            variables: {
              account_id: id,
            },
          });

        case ROLES.client:
          return this.$apollo.mutate({
            mutation: gql`
              mutation InsertClient($account_id: Int!) {
                insert_client_one(object: { account_id: $account_id, preferred_comm_mode: "speech" }) {
                  id
                }
                update_account_by_pk(pk_columns: { id: $account_id }, _set: { role: "client" }) {
                  id
                  role
                }
              }
            `,
            variables: {
              account_id: id,
            },
          });

        case ROLES.service_requestor:
          return this.$apollo.mutate({
            mutation: gql`
              mutation InsertServiceRequestor($account_id: Int!) {
                insert_service_requestor_one(object: { account_id: $account_id }) {
                  id
                }
                update_account_by_pk(pk_columns: { id: $account_id }, _set: { role: "service_requestor" }) {
                  id
                  role
                }
              }
            `,
            variables: {
              account_id: id,
            },
          });
      }
    },

    graphqlDeleteUser(user) {
      return this.$apollo.mutate({
        mutation: gql`
          mutation DeleteUser($id: Int!) {
            delete_account_by_pk(id: $id) {
              id
            }
          }
        `,
        variables: {
          id: user.id,
        },
      });
    },
  },

  apollo: {
    $subscribe: {
      pendingUsers: {
        query: gql`
          subscription AllPendingUsers {
            pendingUsers: account(where: { role: { _eq: "pending" } }) {
              id
              ...accountFields
              created_at
            }
          }
          ${accountFieldsFragment}
        `,
        result({ data }) {
          this.pendingUsers = data.pendingUsers;
        },
      },
    },
  },
};
</script>

<style scoped>
.user-card {
  margin-bottom: 24px;
}
.delete-user-info {
  margin-bottom: 18px;
}
.button-divider {
  color: #b1b1db;
  padding: 0 8px 0 8px;
}
</style>
