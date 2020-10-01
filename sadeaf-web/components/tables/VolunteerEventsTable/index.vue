<template>
  <div>
    <base-table title="Events"
                :rows="tableData"
                :columns="columns"
                :empty-text="'No events yet!'"
                :show-operations="false"
                expandable-rows>
      <!-- Expanded row -->
      <template v-slot:expanded="{ row }">
        <div class="expanded-row">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <h2 style="opacity: 0.5; margin-right: 8px;">Assignments</h2>
          </div>
          <!-- Show assignments as timeline -->
          <assignments-timeline :event_id="row.id"
                                :client="row.client"
                                :editable="false"
                                :assignments="row.assignments"
                                @updateAssignment="assignment => handleUpdateAssignmentClick(row, assignment)" />
        </div>
      </template>

      <!-- Custom columns -->
      <template v-slot:client="{row}">
        <user-card-horizontal-small :user="row.client.account" />
      </template>

      <template v-slot:status="{row}">
        <el-tag :type="row.status === 'COMPLETE' ? 'success' : 'primary'">
          {{row.status}}
        </el-tag>
      </template>
    </base-table>
  </div>
</template>

<script>
import BaseTable from "../BaseTable";
import VolunteersCell from "../custom-columns/VolunteersCell";
import SadeafCreateAssignmentForm from "../../forms/SadeafCreateAssignmentForm";
import AssignmentsTimeline from "../../cards/AssignmentsTimeline";
import UserCardHorizontalSmall from "../../user/UserCardHorizontalSmall";

export default {
  name: "VolunteerEventsTable",

  components: {
    UserCardHorizontalSmall,
    AssignmentsTimeline,
    VolunteersCell,
    SadeafCreateAssignmentForm,
    BaseTable,
  },

  props: {
    events: {
      type: Array,
      required: true,
      default: () => [],
    }
  },

  data() {
    return {
      createAssignmentDialogVisible: false,
      createEventDialogVisible: false,
      updateEvent: null,
      event_id: null,
      client: null,
      updateAssignment: null,
      columns: [
        {
          name: 'client',
          label: 'Client',
        },
        {
          name: 'name',
          label: 'Event',
        },
        {
          name: 'description',
          label: 'Description',
        },
        {
          name: 'status',
          label: 'Status',
        },
      ],
    }
  },

  methods: {
    handleNewEventClick() {
      this.createEventDialogVisible = true
    },
    handleUpdateEventClick(row) {
      this.updateEvent = row;
      this.createEventDialogVisible = true;
    },
    handleUpsertEventCancel() {
      this.createEventDialogVisible = false
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
    mapEventsToRows(events) {
      const rows = [];
      if (events) {
        for (const event of events) {
          let aggStatus = 'COMPLETE';
          for (const { status } of event.statuses.nodes) {
            if (status !== 'COMPLETE') {
              aggStatus = 'ONGOING';
              break;
            }
          }
          console.log(event.client)
          rows.push({
            id: event.id,
            client: event.client,
            status: aggStatus,
            purpose: event.purpose,
            name: event.name,
            description: event.description,
            assignments: event.assignments
          })
        }
      }
      return rows;
    },
  },

  computed: {
    tableData() {
      return this.mapEventsToRows(this.events);
    }
  }
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
</style>
