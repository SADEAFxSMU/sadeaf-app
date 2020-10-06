<template>
  <el-row type="flex" class="volunteer-blacklist-card">
    <el-card
      class="volunteer-blacklist-card"
    >
      // TODO (Austin): Make this responsive
      <el-row
        justify="start"
        class="margin-bottom__md"
        type="flex"
        :gutter="16"
      >
        <el-col :span="1.5">
          <el-avatar
            :size="70"
            shape="square"
            :src="volunteer.account.profile_pic_url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
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

        <el-col class="block-btn" :span="2.5">
          <el-row align="top" justify="center" type="flex">
            <el-button
              type="text"
              @click="handleClickBlock"
            >
              Block
            </el-button>

          </el-row>
        </el-col>
      </el-row>

      <el-row>
        <BlacklistCardAssignments :volunteer="volunteer"
                                  :assignments="volunteer.assignments" />
      </el-row>
    </el-card>
  </el-row>

</template>

<script>
import gql from 'graphql-tag';
import BlacklistCardAssignments from '@/components/cards/BlacklistVolunteerCard/BlacklistCardAssignments';

const BLOCK_MUTATION = gql`mutation MyMutation($volunteer_account_id: Int!, $client_account_id: Int!) {
  insert_blacklist(objects: {volunteer_account_id: $volunteer_account_id, client_account_id: $client_account_id}) {
    returning {
      volunteer_account_id
      client_account_id
    }
  }
}
`;


export default {
  name: 'BlacklistVolunteerCard',
  components: { BlacklistCardAssignments },
  props: {
    volunteer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handleClickBlock() {
      this.$confirm(`This action will block user ${this.volunteer.account.name}. Are you sure?`, 'Warning', {
        confirmButtonText: 'Block',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(async () => {
        try {
          const res = await this.$apollo.mutate({
              mutation: BLOCK_MUTATION,
              variables: {
                client_account_id: this.$store.state.auth.user.id,
                volunteer_account_id: this.volunteer.account.id,
              },
            },
          );

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


      })
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
</style>
<style scoped lang="scss">

.volunteer-blacklist-card {
  width: 500px;
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
