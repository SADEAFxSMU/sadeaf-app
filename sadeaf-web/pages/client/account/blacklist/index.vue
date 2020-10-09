<template>
  <el-row class="blacklist-container">
    <el-row class="margin-bottom__md" type="flex" align="middle">
      <h1 style="padding-right: 16px">Blacklist</h1>
    </el-row>

    <el-tabs type="border-card" ref="tabContainer">
      <el-tab-pane>
        <span slot="label" style="color: red">
          <i class="el-icon-error" />
          Block
        </span>

        <el-row>
          <el-input
            style="width: 400px"
            v-model="blockSearch"
            placeholder="Search for Volunteer or Event Name"
            class="margin-bottom__md"
          />
        </el-row>

        <div v-if="filteredVolunteers.length > 0">
          <el-row type="flex" class="blacklist-cards-row" align="center" justify="start">
            <div
              v-for="volunteer in pagedBlockedCards"
              :key="volunteer.id + volunteer.name + 'blacklist_card'"
              class="margin-bottom__md"
              style="margin-right: 16px"
            >
              <BlacklistVolunteerCard :volunteer="volunteer" />
            </div>
          </el-row>

          <el-row type="flex" justify="center">
            <el-pagination
              layout="prev, pager, next"
              :total="filteredVolunteers.length"
              :page-size="pageSize"
              :current-page.sync="blockListCurrentPage"
            />
          </el-row>
        </div>

        <div v-else>
          <h1 style="color: red">No Volunteer Found!</h1>
        </div>
      </el-tab-pane>

      <el-tab-pane>
        <span slot="label" style="color: green">
          <i class="el-icon-success" />
          Unblock
        </span>

        <el-row>
          <el-input
            style="width: 400px"
            v-model="unblockSearch"
            placeholder="Search for Volunteer or Event Name"
            class="margin-bottom__md"
          />
        </el-row>
        <div v-if="filteredUnblockVolunteers.length > 0">
          <el-row type="flex" class="blacklist-cards-row" align="center" justify="start">
            <div
              v-for="volunteer in pagedUnblockedCards"
              :key="volunteer.id + volunteer.name + 'unblacklist_card'"
              class="margin-bottom__md"
              style="margin-right: 16px"
            >
              <BlacklistVolunteerCard :volunteer="volunteer" :block-card="false" />
            </div>
          </el-row>

          <el-row type="flex" justify="center">
            <el-pagination
              layout="prev, pager, next"
              :total="filteredUnblockVolunteers.length"
              :page-size="pageSize"
              :current-page.sync="unblockListCurrentPage"
            />
          </el-row>
        </div>

        <div v-else>
          <h1 v-if="unblockSearch" style="color: red">No Volunteer Found!</h1>
          <h1 v-else style="color: red">No Volunteer Blocked!</h1>
        </div>
      </el-tab-pane>
    </el-tabs>

    <client-blacklist-dialog :visible="viewMoreVisible"></client-blacklist-dialog>
  </el-row>
</template>

<script>
import BlacklistVolunteerCard from '@/components/cards/BlacklistVolunteerCard/index';
import gql from 'graphql-tag';
import ClientBlacklistDialog from '@/components/dialogs/ClientBlacklistDialog';

const CLIENT_VOLUNTEER_BLOCK_SUB = gql`
  subscription sub($client_acc_id: Int!) {
    assignment(
      where: {
        event: { client: { account_id: { _eq: $client_acc_id } }, assignments: { status: { _eq: "COMPLETE" } } }
        volunteer: { _not: { blacklists: { client_account_id: { _eq: $client_acc_id } } } }
      }
      distinct_on: volunteer_id
    ) {
      volunteer {
        id
        account {
          contact
          email
          id
          profile_pic_url
          name
        }
        assignments(
          where: { event: { client: { account_id: { _eq: $client_acc_id } } }, status: { _eq: "COMPLETE" } }
          order_by: { start_dt: desc }
        ) {
          id
          status
          start_dt
          event {
            name
            id
            description
          }
        }
      }
    }
  }
`;

const CLIENT_VOLUNTEER_UNBLOCK_SUB = gql`
  subscription sub($client_acc_id: Int!) {
    blacklist(where: { client_account_id: { _eq: $client_acc_id } }) {
      id
      volunteer {
        assignments(
          where: {
            event: { client: { account_id: { _eq: $client_acc_id } }, assignments: { status: { _eq: "COMPLETE" } } }
          }
        ) {
          id
          status
          start_dt
          event {
            description
            name
            id
          }
        }
        account {
          id
          email
          name
          contact
          profile_pic_url
        }
      }
    }
  }
`;

export default {
  name: 'blacklist',
  components: { ClientBlacklistDialog, BlacklistVolunteerCard },
  data() {
    return {
      volunteers: [],
      unblockVolunteers: [],
      blockSearch: '',
      unblockSearch: '',
      colCount: 3,
      blockListCurrentPage: 1,
      unblockListCurrentPage: 1,
      pageSize: 9,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    viewMoreVisible() {
      return this.$store.state.clientBlacklist.visible;
    },
    filteredVolunteers() {
      this.blockListCurrentPage = 1;
      return this.volunteers.filter((v) => {
        if (!this.blockSearch) return true;
        const searchString = this.blockSearch.toLowerCase();
        return (
          v.volunteerName.toLowerCase().includes(searchString) || v.eventNames.some((e) => e.indexOf(searchString) >= 0)
        );
      });
    },
    filteredUnblockVolunteers() {
      this.blockListCurrentPage = 1;
      return this.unblockVolunteers.filter((v) => {
        if (!this.unblockSearch) return true;
        const searchString = this.unblockSearch.toLowerCase();
        return (
          v.volunteerName.toLowerCase().includes(searchString) || v.eventNames.some((e) => e.indexOf(searchString) >= 0)
        );
      });
    },
    pagedBlockedCards() {
      let endIndex = this.blockListCurrentPage * this.pageSize;
      let startIndex = endIndex - this.pageSize;
      return this.filteredVolunteers.slice(startIndex, endIndex);
    },
    pagedUnblockedCards() {
      let endIndex = this.unblockListCurrentPage * this.pageSize;
      let startIndex = endIndex - this.pageSize;
      return this.filteredUnblockVolunteers.slice(startIndex, endIndex);
    },
  },
  apollo: {
    $subscribe: {
      volunteers: {
        query: CLIENT_VOLUNTEER_BLOCK_SUB,
        variables() {
          return { client_acc_id: this.user.id };
        },
        result({ data }) {
          this.volunteers = data.assignment.map((v) => ({
            ...v.volunteer,
            volunteerName: v.volunteer.account.name,
            eventNames: v.volunteer.assignments.map((a) => a.event.name.toLowerCase()),
          }));
        },
      },
      unblockVolunteers: {
        query: CLIENT_VOLUNTEER_UNBLOCK_SUB,
        variables() {
          return { client_acc_id: this.user.id };
        },
        result({ data }) {
          this.unblockVolunteers = data.blacklist.map((v) => ({
            ...v.volunteer,
            volunteerName: v.volunteer.account.name,
            eventNames: v.volunteer.assignments.map((a) => a.event.name.toLowerCase()),
          }));
        },
      },
    },
  },
};
</script>

<style scoped lang="scss">
.blacklist-cards-row {
  flex-wrap: wrap;

  @media (max-width: 450px) {
    overflow: scroll hidden;
  }
}

.blacklist-container {
  padding-left: 20px;
  padding-right: 20px;
}

.margin-bottom__md {
  margin-bottom: 16px;
}
</style>
