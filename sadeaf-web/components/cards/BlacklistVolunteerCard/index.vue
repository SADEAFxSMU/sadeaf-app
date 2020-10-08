<template>
  <div>
    <el-card class="volunteer-blacklist-card">
      <el-row justify="start" class="margin-bottom__md" type="flex" :gutter="16">
        <el-col :span="1.5">
          <el-avatar
            :size="70"
            shape="square"
            :src="
              volunteer.account.profile_pic_url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
          />
        </el-col>

        <el-col :span="20">
          <el-row class="margin-bottom__sm">
            <h3>{{ volunteer.account.name }}</h3>
          </el-row>

          <el-row class="margin-bottom__sm">
            <div class="el-icon-message" />
            <el-divider direction="vertical" />
            {{ volunteer.account.email }}
          </el-row>

          <el-row>
            <div class="el-icon-s-cooperation" />
            <el-divider direction="vertical" />
            {{ volunteer.assignments.length }}

            <el-tooltip content="Number of Assignments Completed">
              <div style="color: grey" class="el-icon-info"></div>
            </el-tooltip>
          </el-row>
        </el-col>

        <el-col :span="2.5">
          <el-row class="block-btn" v-if="blockCard" align="top" justify="center" type="flex">
            <el-tooltip
              content="Blocking this volunteer will prompt SADeaf to try and re-assign
            all assignments that are paired with this volunteer to another volunteer"
            >
              <el-button type="text" @click="handleClickBlock"> Block</el-button>
            </el-tooltip>
          </el-row>

          <el-row class="unblock-btn" v-else align="top" justify="center" type="flex">
            <el-button type="text" @click="handleClickUnblock"> Unblock</el-button>
          </el-row>
        </el-col>
      </el-row>

      <el-row>
        <BlacklistCardAssignments :volunteer="volunteer" :assignments="volunteer.assignments" />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import BlacklistCardAssignments from '@/components/cards/BlacklistVolunteerCard/BlacklistCardAssignments';

const BLOCK_MUTATION = gql`
  mutation MyMutation($volunteer_account_id: Int!, $client_account_id: Int!) {
    insert_blacklist(objects: { volunteer_account_id: $volunteer_account_id, client_account_id: $client_account_id }) {
      returning {
        volunteer_account_id
        client_account_id
      }
    }
  }
`;

const UNBLOCK_DELETE = gql`
  mutation MyMutation($volunteer_account_id: Int!, $client_account_id: Int!) {
    delete_blacklist(
      where: { volunteer_account_id: { _eq: $volunteer_account_id }, client_account_id: { _eq: $client_account_id } }
    ) {
      affected_rows
    }
  }
`;

export default {
  name: 'BlacklistVolunteerCard',
  components: { BlacklistCardAssignments },
  props: {
    client: {
      type: Object,
      required: false,
      default: { id: null },
    },
    volunteer: {
      type: Object,
      required: true,
    },
    blockCard: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClickBlock() {
      this.$confirm(
        `This action will block user ${this.volunteer.account.name}. \n
      Doing so will prompt SADeaf to try and re-assign all assignments that are paired with this volunteer to another volunteer
       Are you sure?`,
        'Warning',
        {
          confirmButtonText: 'Block',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(async () => {
        try {
          await this.$apollo.mutate({
            mutation: BLOCK_MUTATION,
            variables: {
              client_account_id: this.client.id || this.$store.state.auth.user.id,
              volunteer_account_id: this.volunteer.account.id,
            },
          });

          this.$message({
            type: 'success',
            message: `Blocked ${this.volunteer.account.name}`,
          });
        } catch (e) {
          this.$message({
            type: 'error',
            message: `Failed to Block ${this.volunteer.account.name}!
            Please contact admin if this action repeatedly fails.`,
          });
        }
      });
    },
    handleClickUnblock() {
      this.$confirm(`This action will unblock user ${this.volunteer.account.name}. Are you sure?`, 'Warning', {
        confirmButtonText: 'Unblock',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        try {
          await this.$apollo.mutate({
            mutation: UNBLOCK_DELETE,
            variables: {
              client_account_id: this.client.id || this.$store.state.auth.user.id,
              volunteer_account_id: this.volunteer.account.id,
            },
          });

          this.$message({
            type: 'success',
            message: `Unblocked ${this.volunteer.account.name}`,
          });
        } catch (e) {
          console.log(e);
          this.$message({
            type: 'error',
            message: `Failed to Unblock ${this.volunteer.account.name}!
            Please contact admin if this action repeatedly fails.`,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.block-btn {
  .el-button {
    padding-top: 0;
    color: red;
  }
}

.unblock-btn {
  .el-button {
    padding-top: 0;
    color: green;
  }
}
</style>
<style scoped lang="scss">
.volunteer-blacklist-card {
  width: 100%;
  max-width: 500px;
  height: 100%;
}

.margin-bottom {
  &__sm {
    margin-bottom: 8px;

    &-not-last:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__md {
    margin-bottom: 16px;
  }
}
</style>
