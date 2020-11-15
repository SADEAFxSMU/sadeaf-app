<template>
  <div>
    <base-table title="Service Requests" :rows="tableData" :columns="columns" expandable-rows>
      <template v-slot:toolbar>
        <el-button icon="el-icon-plus" @click="handleNewEventClick" />
      </template>
      <!-- Expanded row -->
      <template v-slot:expanded="{ row }">
        <div class="expanded-row">
          <div style="display: flex; align-items: center; margin-bottom: 16px">
            <h2 style="opacity: 0.5; margin-right: 8px">Assignments</h2>
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

      <!-- Extra columns (make sure to declare in :columns) -->
      <template v-slot:status="{ row }">
        <el-tag :type="row.status === 'COMPLETE' ? 'success' : 'primary'">
          {{ row.status }}
        </el-tag>
      </template>

      <template v-slot:charges="{ row }">
        <span>{{
          hideEventTotalCharges(row.assignments)
            ? 'Event not complete'
            : '$' + calculateEventTotalCharges(row.assignments)
        }}</span>
      </template>

      <template v-slot:skillsRequired="{ row }">
        <span v-if="row.skillsRequired.notetakerRequired">
          <NotetakerRequiredTag />
        </span>
        <span v-if="row.skillsRequired.interpreterRequired">
          <InterpreterRequiredTag />
        </span>
        <span v-if="!row.skillsRequired.interpreterRequired && !row.skillsRequired.notetakerRequired">
          <el-tag size="small" type="warning"> No Skillset Stated </el-tag>
        </span>
      </template>

      <template v-slot:volunteers="{ row }">
        <volunteers-cell :volunteers="row.volunteers" v-if="row.volunteers && row.volunteers.length > 0" />
      </template>

      <template v-slot:edit="{ row }">
        <el-button type="text" size="small" @click="handleUpdateEventClick(row)"> Edit </el-button>
      </template>
    </base-table>
    <el-dialog title="Create New Event" :visible="createEventDialogVisible" @close="handleUpsertEventCancel">
      <sadeaf-create-event-form
        :event="updateEvent"
        @success="createEventDialogVisible = false"
        @cancel="handleUpsertEventCancel"
      />
    </el-dialog>
    <!--    Manually edit client's assignment for admin-->
    <el-dialog
      title="Manual Client-Volunteer Assignment"
      :visible="createAssignmentDialogVisible"
      @close="handleAssignmentFormCancel"
    >
      <sadeaf-create-assignment-form
        v-if="createAssignmentDialogVisible"
        :event_id="event_id"
        :client="client"
        :assignment="updateAssignment"
        @success="createAssignmentDialogVisible = false"
        @cancel="handleAssignmentFormCancel"
      />
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '../BaseTable';
import VolunteersCell from '../custom-columns/VolunteersCell';
import UserCardHorizontalSmall from '../../user/UserCardHorizontalSmall';
import SadeafCreateAssignmentForm from '../../forms/SadeafCreateAssignmentForm';
import gql from 'graphql-tag';
import AssignmentsTimeline from '../../cards/AssignmentsTimeline';
import SadeafCreateEventForm from '../../forms/SadeafCreateEventForm';
import { DateUtils } from '../../../common/date-utils';
import { CLIENT_CHARGE_PER_HOUR, ASSIGNMENT_STATUSES } from '../../../common/types/constants';
import NotetakerRequiredTag from '@/components/tags/NotetakerRequiredTag';
import InterpreterRequiredTag from '@/components/tags/InterpreterRequiredTag';

export default {
  name: 'AdminEventsTable',
  components: {
    InterpreterRequiredTag,
    NotetakerRequiredTag,
    SadeafCreateEventForm,
    AssignmentsTimeline,
    UserCardHorizontalSmall,
    VolunteersCell,
    SadeafCreateAssignmentForm,
    BaseTable,
  },
  data() {
    return {
      schema: 'event',
      role: 'admin',
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
          name: 'skillsRequired',
          label: 'Skills Required',
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
          name: 'charges',
          label: 'Event Total Charges',
        },
        {
          name: 'status',
          label: 'Status',
        },
        {
          name: 'volunteers',
          label: 'Volunteers',
        },
      ],
      tableData: [],
    };
  },

  methods: {
    hideEventTotalCharges(assignments) {
      return assignments.filter((assignment) => assignment.status !== ASSIGNMENT_STATUSES.COMPLETE).length > 0;
    },
    calculateEventTotalCharges(assignments) {
      return assignments
        .reduce((acc, cur) => acc + DateUtils.differenceInHours(cur.start_dt, cur.end_dt) * CLIENT_CHARGE_PER_HOUR, 0)
        .toLocaleString();
    },
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
          let aggStatus = 'COMPLETE';
          for (const { status } of event.statuses.nodes) {
            if (status !== 'COMPLETE') {
              aggStatus = 'ONGOING';
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
            skillsRequired: {
              notetakerRequired: event.notetaker_required,
              interpreterRequired: event.interpreter_required,
            },
          });
        }
      }
      this.tableData = rows;
    },

    setSummaryStats(events) {
      let matched = 0;
      let unmatched = 0;
      events.forEach((event) => {
        event.assignments.forEach((assignment) => {
          if (assignment.volunteer) {
            matched++;
          } else {
            unmatched++;
          }
        });
      });
      this.$emit('summary', { matched, unmatched });
    },
  },

  apollo: {
    $subscribe: {
      event: {
        query: gql`
          subscription EventsSubscription {
            events: event(order_by: { assignments_aggregate: { max: { start_dt: desc_nulls_last } } }) {
              id
              name
              description
              interpreter_required
              notetaker_required
              purpose
              client {
                id
                account {
                  id
                  name
                  email
                  role
                  profile_pic_url
                }
              }
              statuses: assignments_aggregate(distinct_on: status) {
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
                      email
                      profile_pic_url
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
                    role
                    profile_pic_url
                  }
                }
              }
            }
          }
        `,
        result({ data }) {
          data.events.forEach((event) => {
            event.assignments.forEach((assignment) => {
              assignment.start_dt = DateUtils.utcToGmt8(assignment.start_dt);
              assignment.end_dt = DateUtils.utcToGmt8(assignment.end_dt);
            });
          });
          this.mapQueryResponseToRows(data.events);
          this.setSummaryStats(data.events);
        },
      },
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
</style>
