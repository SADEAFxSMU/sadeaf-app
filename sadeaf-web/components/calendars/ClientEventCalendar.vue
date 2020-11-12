<!--suppress CssUnusedSymbol -->
<template>
  <div class="client-cal">
    <el-tabs v-model="tab" :tab-position="isMobileView ? 'top' : 'left'">
      <el-tab-pane label="My Events" name="events">
        <div class="calendar">
          <el-calendar @input="handleCalendarClick" style="height: 700px">
            <template slot="dateCell" slot-scope="{ date }">
              <h4 :class="{ greyed: isBeforeToday(date) }">{{ date.getDate() }}</h4>
              <div v-if="getAssignmentsOnDate(date)" class="assignment-cell">
                <div v-for="assignment in getAssignmentsOnDate(date)" class="body">
                  <el-tag size="mini">
                    {{ assignment.event.name }}
                  </el-tag>
                </div>
              </div>
            </template>
          </el-calendar>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible="createServiceRequestDialogVisible"
      @close="handleServiceRequestDialogClose"
      :fullscreen="isMobileView"
      :title="selectedDateReadable"
    >
      <el-tabs v-model="dialogTab">
        <el-tab-pane label="Assignments" name="assignments">
          <div class="assignment-cards" v-if="getAssignmentsOnDate(selectedDate)">
            <assignment-card
              v-for="assignment in getAssignmentsOnDate(selectedDate)"
              :key="'as-' + assignment.id"
              :details="assignment"
              :show-edit="assignment.status !== cancelledText() && assignment.status !== completedText()"
              :show-attendance="assignment.status === 'COMPLETE'"
              @editClick="handleEditAssignmentClick"
              @showAttendance="handleShowAttendanceDialog(assignment)"
            />
          </div>
          <no-data-placeholder text="No assignments yet!" style="height: 200px" v-else />
        </el-tab-pane>
        <el-tab-pane label="Create New Assignment" name="request" v-if="isAfterToday(selectedDate)">
          <client-create-event-form
            :date="selectedDate"
            @cancel="handleUpsertEventCancel"
            @success="handleUpsertEventSuccess"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="updateAssignment"
          :label="`Update ${updateAssignment && updateAssignment.event.name} details`"
          name="update"
        >
          <client-upsert-assignment-form
            :assignment="updateAssignment"
            @success="handleEditAssignmentConfirm"
            @cancel="handleEditAssignmentCancel"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <attendance-confirmation-dialog
      v-if="showAttendanceDialog"
      :is-visible="showAttendanceDialog"
      :assignment="selectedAssignmentForAttendance"
      :show-dispute-only="true"
      @onClose="handleCloseAttendanceDialog"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import ClientCreateEventForm from '../forms/ClientCreateEventForm';
import UserCard from '../user/UserCard';
import AssignmentCard from '../cards/AssignmentCard';
import ClientUpsertAssignmentForm from '../forms/ClientUpsertAssignmentForm';
import { DateUtils } from '@/common/date-utils';
import dayjs from 'dayjs';
import { ASSIGNMENT_STATUSES } from '@/common/types/constants';
import { isMobileViewMixin } from '../../common/mixins';
import NoDataPlaceholder from '../NoDataPlaceholder';
import AttendanceConfirmationDialog from '@/components/dialogs/AttendanceConfirmationDialog';

export default {
  name: 'ClientEventCalendar',

  mixins: [isMobileViewMixin],

  components: {
    NoDataPlaceholder,
    ClientUpsertAssignmentForm,
    AssignmentCard,
    UserCard,
    ClientCreateEventForm,
    AttendanceConfirmationDialog,
  },

  data() {
    return {
      assignments: [],
      assignmentsByDateTime: {},
      selectedDate: null,
      updateEvent: null,
      updateAssignment: null,
      tab: 'events',
      dialogTab: 'assignments',
      updateAssignmentDialogVisible: false,
      showAttendanceDialog: false,
      selectedAssignmentForAttendance: undefined,
      createServiceRequestDialogVisible: false,
    };
  },

  methods: {
    handleCalendarClick(date) {
      this.selectedDate = date;
      if (this.getAssignmentsOnDate(date)) {
        this.dialogTab = 'assignments';
      } else if (this.isAfterToday(date)) {
        this.dialogTab = 'request';
      }
      if (this.isAfterToday(date) || this.getAssignmentsOnDate(date)) {
        this.createServiceRequestDialogVisible = true;
      }
    },

    handleServiceRequestDialogClose() {
      this.createServiceRequestDialogVisible = false;
      this.updateAssignment = null;
      this.dialogTab = 'assignments';
    },

    handleEditAssignmentClick(assignment) {
      this.updateAssignment = {
        ...assignment,
        notetaker_required: assignment.event.notetaker_required,
        interpreter_required: assignment.event.interpreter_required,
      };
      this.updateAssignmentDialogVisible = true;
      this.dialogTab = 'update';
    },

    handleEditAssignmentConfirm() {
      this.updateAssignment = null;
      this.dialogTab = 'assignments';
    },

    handleEditAssignmentCancel() {
      this.dialogTab = 'assignments';
    },

    handleUpsertEventCancel() {
      this.createServiceRequestDialogVisible = false;
    },
    handleUpsertEventSuccess() {
      this.dialogTab = 'assignments';
    },
    getAssignmentsOnDate(date) {
      const dateKey = dayjs(date).format('YYYYMMDD');
      return this.assignmentsByDateTime[dateKey];
    },
    isBeforeToday(date) {
      return DateUtils.isBeforeToday(date);
    },
    isAfterToday(date) {
      return DateUtils.isAfterToday(date);
    },
    cancelledText() {
      return ASSIGNMENT_STATUSES.CANCELLED;
    },
    completedText() {
      return ASSIGNMENT_STATUSES.COMPLETE;
    },
    handleShowAttendanceDialog(assignment) {
      this.showAttendanceDialog = true;
      this.selectedAssignmentForAttendance = assignment;
    },
    handleCloseAttendanceDialog() {
      this.showAttendanceDialog = false;
      this.selectedAssignmentForAttendance = undefined;
    },
  },

  computed: {
    client() {
      return this.$store.state.auth.user.client;
    },
    selectedDateReadable() {
      return DateUtils.humanReadableDate(this.selectedDate);
    },
  },

  apollo: {
    $subscribe: {
      assignments: {
        query: gql`
          subscription AssignmentsSubscription($client_id: Int!) {
            assignments: assignment(where: { event: { client_id: { _eq: $client_id } } }, order_by: { start_dt: asc }) {
              id
              address_line_one
              address_line_two
              room_number
              postal
              start_dt
              end_dt
              status
              event {
                id
                name
                notetaker_required
                interpreter_required
              }
              volunteer {
                id
                account {
                  id
                  name
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
          data.assignments.forEach((assignment) => {
            assignment.start_dt = DateUtils.utcToGmt8(assignment.start_dt);
            assignment.end_dt = DateUtils.utcToGmt8(assignment.end_dt);
          });
          this.assignments = data.assignments;
          this.assignmentsByDateTime = DateUtils.groupAssignmentsByDateTime(data.assignments);
        },
      },
    },
  },
};
</script>

<style scoped>
.client-cal {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  height: 700px;
}

.calendar {
  flex: 1;
  box-shadow: 2px 2px 6px 1px #d3d7ea;
  border-radius: 8px;
  overflow: hidden;
}

.assignment-cell {
  margin-top: 4px;
  overflow: scroll;
  max-height: 55px;
}

.assignment-cell .body {
  margin-bottom: 4px;
}

.assignment-command-panel {
  flex: 1;
  height: 100%;
  padding-left: 24px;
  overflow: scroll;
}

.assignment-cards {
}

.fade-enter-active,
.fade-leave-active {
  flex: 1;
  transition: flex 0.3s;
}

.fade-enter,
.fade-leave-to {
  flex: 0;
}

.greyed {
  color: #cbcbcb;
}
</style>
