<template>
  <div>
    <base-table title="Service Requests" :rows="tableData" :columns="columns" expandable-rows>
      <template v-slot:toolbar>
        <el-button icon="el-icon-plus" @click="handleNewEventClick" />
      </template>
      <!-- Expanded row -->
      <template v-slot:expanded="{ row }">
        <div class="expanded-row">
          <div class="body">
            <h2 class="title">Assignments</h2>
            <el-button icon="el-icon-plus" size="mini" @click="handleNewAssignmentClick(row)" />
          </div>
          <!-- Show assignments as timeline -->
          <assignments-timeline
            :event_id="row.id"
            :client="row.client"
            :assignments="row.assignments"
            @updateAssignment="(assignment) => handleUpdateAssignmentClick(row, assignment)"
          />
        </div>
      </template>

      <template v-slot:client="{ row }">
        <user-card-horizontal-small :user="row.client.account" />
      </template>

      <!-- Custom columns -->
      <template v-slot:status="{ row }">
        <el-tag :type="row.status === 'COMPLETE' ? 'success' : 'primary'">
          {{ row.status }}
        </el-tag>
      </template>

      <!-- Extra columns (make sure to declare in :columns -->
      <template v-slot:volunteers="{ row }">
        <volunteers-cell :volunteers="row.volunteers" v-if="row.volunteers && row.volunteers.length > 0" />
      </template>

      <template v-slot:edit="{ row }">
        <el-button type="text" size="small" @click="handleUpdateEventClick(row)"> Edit </el-button>
      </template>
    </base-table>
  </div>
</template>

<script>
import BaseTable from "../BaseTable";
import VolunteersCell from "../custom-columns/VolunteersCell";
import UserCardHorizontalSmall from "../../user/UserCardHorizontalSmall";
import SadeafCreateAssignmentForm from "../../forms/SadeafCreateAssignmentForm";
import gql from "graphql-tag";
import AssignmentsTimeline from "../../cards/AssignmentsTimeline";
import ClientCreateEventForm from "../../forms/ClientCreateEventForm";

export default {
  name: "ClientEventsTable",

  components: {
    ClientCreateEventForm,
    AssignmentsTimeline,
    UserCardHorizontalSmall,
    VolunteersCell,
    SadeafCreateAssignmentForm,
    BaseTable,
  },

  data() {
    return {
      createAssignmentDialogVisible: false,
      createEventDialogVisible: false,
      updateEvent: null,
      updateAssignment: null,
      columns: [
        {
          name: "name",
          label: "Event",
        },
        {
          name: "description",
          label: "Description",
        },
        {
          name: "upcoming",
          label: "Upcoming",
        },
        {
          name: "status",
          label: "Status",
        },
        {
          name: "volunteers",
          label: "Volunteers",
        },
      ],
      tableData: [],
    };
  },

  methods: {
    handleNewEventClick() {
      this.createEventDialogVisible = true;
    },
    handleUpdateEventClick(row) {
      this.updateEvent = row;
      this.createEventDialogVisible = true;
    },
    handleUpsertEventCancel() {
      this.createEventDialogVisible = false;
      this.updateEvent = null;
    },
    handleNewAssignmentClick(row) {
      this.event_id = row.id;
      this.client = row.client;
      this.updateAssignment = null;
      this.createAssignmentDialogVisible = true;
    },
    handleUpdateAssignmentClick(row, assignment) {
      this.event_id = row.id;
      this.client = row.client;
      this.updateAssignment = assignment;
      this.createAssignmentDialogVisible = true;
    },
    handleAssignmentFormCancel() {
      this.createAssignmentDialogVisible = false;
      this.updateAssignment = null;
    },
    mapQueryResponseToRows(events) {
      const rows = [];
      if (events) {
        for (const event of events) {
          let aggStatus = "COMPLETE";
          for (const { status } of event.statuses.nodes) {
            if (status !== "COMPLETE") {
              aggStatus = "ONGOING";
              break;
            }
          }
          rows.push({
            id: event.id,
            client: event.client,
            status: aggStatus,
            purpose: event.purpose,
            name: event.name,
            description: event.description,
            volunteers: event.volunteers.nodes.filter((node) => node.volunteer).map((node) => node.volunteer),
            assignments: event.assignments,
          });
        }
      }
      this.tableData = rows;
    },
  },

  apollo: {
    $subscribe: {
      event: {
        query: gql`
          subscription EventsSubscription($client_id: Int!) {
            events: event(
              where: { client_id: { _eq: $client_id } }
              order_by: { assignments_aggregate: { max: { start_dt: desc_nulls_last } } }
            ) {
              id
              name
              description
              purpose
              client {
                id
                account {
                  id
                  name
                  email
                }
              }
              statuses: assignments_aggregate(distinct_on: status, limit: 1) {
                nodes {
                  status
                }
              }
              volunteers: assignments_aggregate(distinct_on: volunteer_id) {
                nodes {
                  volunteer {
                    id
                    account {
                      id
                      name
                    }
                  }
                }
              }
              assignments(order_by: { start_dt: desc }) {
                id
                address_line_one
                address_line_two
                postal
                start_dt
                end_dt
                status
                volunteer {
                  id
                  account {
                    id
                    name
                  }
                }
              }
            }
          }
        `,
        variables() {
          return {
            client_id: this.client.id,
          };
        },
        skip() {
          return !this.client;
        },
        result({ data }) {
          this.mapQueryResponseToRows(data.events);
        },
      },
    },
  },
  computed: {
    client() {
      return this.$store.state.auth.user.client;
    },
  },
};
</script>

<style scoped>
.expanded-row {
  background: white;
  box-shadow: inset 2px 2px 10px #d4e0ec;
  padding: 18px;
  border-radius: 6px;
  overflow: hidden;
}
.expanded-row .body {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.expanded-row .title {
  opacity: 0.5;
  margin-right: 8px;
}
</style>
