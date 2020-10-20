<template>
  <div class="main">
    <div class="calendar">
      <el-calendar @input="handleCalendarClick" style="height: 700px">
        <template slot="dateCell" slot-scope="{ date }">
          <h4 :class="{ greyed: isBeforeToday(date) }">{{ date.getDate() }}</h4>

          <div v-if="getAssignmentsOnDate(date)" class="assignment-cell">
            <div v-for="assignment in getAssignmentsOnDate(date)" class="body">
              <el-tag size="mini" :type="tagType(assignment)">
                {{ assignment.event.name }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
    <div class="assignment-command-panel">
      <el-tabs v-model="tab">
        <el-tab-pane
          v-if="getAssignmentsOnDate(selectedDate)"
          :label="selectedDate.toDateString() + ' Session'"
          name="acceptedAssignments"
        >
          <div class="assignment-cards">
            <assignment-card
              v-for="assignment in getAssignmentsOnDate(selectedDate)"
              :key="'as-' + assignment.id"
              :show-edit="assignment.status === 'MATCHED'"
              :show-cancel="assignment.status === 'MATCHED'"
              :details="assignment"
              @editClick="cancelMatchedAssignment"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Available Assignments" name="pendingAssignments">
          <div>
            <assignment-card
              v-for="assignment in latestPendingAssignmentsFromHasura"
              :key="'pend-as-' + assignment.id"
              :details="assignment"
              :to-accept="true"
              @editClick="showAcceptPendingAssignmentDialog"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Opt-In History" name="optInHistory">
          <div>
            <div v-if="volunteerOptedInAssignments.length === 0">
              <span>You haven't opted in for any assignments!</span>
            </div>
            <assignment-card
              v-for="optInDetails in volunteerOptedInAssignments"
              :key="'optin-as-' + optInDetails.id"
              :details="optInDetails"
              :show-edit="optInDetails.status === 'OPTED_IN'"
              :is-opt-in="true"
              :show-cancel="true"
              @editClick="optOutOfAssignment"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <accept-assignment-details-dialog
      v-if="showAcceptDialog"
      :is-visible="showAcceptDialog"
      :assignment="selectedAssignment"
      @onClose="handleAcceptDialogClose"
    />
  </div>
</template>

<script>
import { DateUtils } from '../../common/date-utils';
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import AssignmentCard from '../cards/AssignmentCard';
import AcceptAssignmentDetailsDialog from '../dialogs/AcceptAssignmentDetailsDialog';
import _ from 'lodash';

const assignmentQuery = gql`
  subscription VolunteerAllAssignments($volunteer_id: Int!) {
    assignments: assignment(where: { volunteer_id: { _eq: $volunteer_id } }) {
      id
      latitude
      longitude
      postal
      room_number
      start_dt
      status
      address_line_one
      address_line_two
      end_dt
      event {
        id
        name
        description
        purpose
      }
    }
  }
`;

const volunteerPendingAssignmentsQuery = gql`
  subscription VolunteerPendingAssignments($volunteer_id: Int!, $account_id: Int!) {
    pending_assignments: assignment(
      where: {
        status: { _eq: "PENDING" }
        _not: { volunteer_assignment_opt_ins: { volunteer_id: { _eq: $volunteer_id } } }
        event: { client: { _not: { blacklists: { volunteer_account_id: { _eq: $account_id } } } } }
      }
    ) {
      id
      latitude
      longitude
      postal
      room_number
      start_dt
      status
      address_line_one
      address_line_two
      end_dt
      event {
        id
        name
        description
        notetaker_required
        interpreter_required
        purpose
      }
    }
  }
`;

const volunteerOptInQuery = gql`
  subscription VolunteerOptIns($volunteer_id: Int!) {
    volunteer_assignment_opt_in(
      where: {
        volunteer_id: { _eq: $volunteer_id }
        status: { _eq: "OPTED_IN" }
        assignment: { status: { _nin: ["COMPLETE", "MATCHED"] } }
      }
    ) {
      id
      assignment_id
      volunteer_id
      status
      assignment {
        id
        latitude
        longitude
        postal
        room_number
        start_dt
        status
        address_line_one
        address_line_two
        end_dt
        event {
          id
          name
          description
          purpose
        }
      }
    }
  }
`;

const cancelAssignmentQuery = gql`
  mutation cancelAssignment($assignment_id: Int!, $volunteer_id: Int!) {
    update_assignment_by_pk(pk_columns: { id: $assignment_id }, _set: { status: "PENDING", volunteer_id: null }) {
      id
      status
    }

    update_volunteer_assignment_opt_in(
      where: { assignment_id: { _eq: $assignment_id }, volunteer_id: { _eq: $volunteer_id } }
      _set: { status: "OPTED_OUT" }
    ) {
      affected_rows
    }
  }
`;

const optOutOfOptedInAssignmentQuery = gql`
  mutation optOutOfOptedInAssignment($opt_in_assignment_id: Int!) {
    update_volunteer_assignment_opt_in_by_pk(pk_columns: { id: $opt_in_assignment_id }, _set: { status: "OPTED_OUT" }) {
      id
      status
    }
  }
`;

export default {
  name: 'VolunteerEventCalendar',
  components: { AcceptAssignmentDetailsDialog, AssignmentCard },
  props: {
    volunteer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      assignments: [],
      pendingAssignments: [],
      selectedDate: null,
      tab: 'pendingAssignments',
      showAcceptDialog: false,
      selectedAssignment: undefined,
      volunteerOptedInAssignments: [],
    };
  },
  methods: {
    tagType(assignment) {
      return assignment.status === 'COMPLETE' ? 'success' : '';
    },
    isBeforeToday(date) {
      return DateUtils.isBeforeToday(date);
    },
    getAssignmentsOnDate(date) {
      const dateKey = dayjs(date).format('YYYYMMDD');
      const assignmentsByDt = this.assignmentsByDateTime[dateKey];
      let assignments;

      if (assignmentsByDt) {
        assignments = _.pickBy(assignmentsByDt, (asg) => asg.status === 'MATCHED' || asg.status === 'COMPLETE');
      }
      // Need to check for empty object since pickBy returns an empty object
      // if there are no matches. Return undefined if empty since {} evaluates to true in js
      // which is undesirable behaviour for v-if
      return _.isEmpty(assignments) ? undefined : assignments;
    },

    handleCalendarClick(date) {
      this.selectedDate = date;
      if (this.getAssignmentsOnDate(date)) {
        this.tab = 'acceptedAssignments';
      } else {
        this.tab = 'pendingAssignments';
      }
    },
    showAcceptPendingAssignmentDialog(assignment) {
      this.showAcceptDialog = true;
      this.selectedAssignment = assignment;
    },
    handleAcceptDialogClose() {
      this.showAcceptDialog = false;
    },
    optOutOfAssignment(optInDetails) {
      const text = 'This will opt you out from this assignment. You will not be able to opt in again. Are you sure?';
      this.$confirm(text, 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          console.log(optInDetails);
          this.$apollo
            .mutate({
              mutation: optOutOfOptedInAssignmentQuery,
              variables: {
                opt_in_assignment_id: optInDetails.id,
              },
            })
            .then((_) => {
              this.$notify.success('Opted out for Assignment');
            })
            .catch((error) => {
              this.$notify.error('Something went wrong with opting out of the assignment');
              console.log(error);
            });
        })
        .catch(() => {
          // do nothing if the user pressed cancel
        });
    },
    cancelMatchedAssignment(assignment) {
      this.$confirm(
        'This will un-match you from this assignment and you will not be able to see it again. Are you sure?',
        'Warning',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          this.$apollo
            .mutate({
              mutation: cancelAssignmentQuery,
              variables: {
                assignment_id: assignment.id,
                volunteer_id: this.$store.state.auth.user.volunteer.id,
              },
            })
            .then((_) => {
              this.$notify.success('Assignment Cancelled');
              this.tab = 'pendingAssignments';
            })
            .catch((error) => {
              this.$notify.error('Something went wrong with cancelling the assignment');
              console.log(error);
            });
        })
        .catch(() => {
          // do nothing if the user pressed cancel
        });
    },
  },
  computed: {
    assignmentsByDateTime() {
      return DateUtils.groupAssignmentsByDateTime(this.assignments);
    },
    latestPendingAssignmentsFromHasura() {
      return this.pendingAssignments;
    },
  },
  apollo: {
    $subscribe: {
      assignments: {
        query: assignmentQuery,
        variables() {
          return {
            volunteer_id: this.volunteer.id,
          };
        },
        result({ data }) {
          data.assignments.forEach((assignment) => {
            assignment.start_dt = DateUtils.utcToGmt8(assignment.start_dt);
            assignment.end_dt = DateUtils.utcToGmt8(assignment.end_dt);
          });
          this.assignments = data.assignments;
        },
      },
      volunteer_assignment_opt_in: {
        query: volunteerOptInQuery,
        variables() {
          return {
            volunteer_id: this.volunteer.id,
          };
        },
        result({ data }) {
          data.volunteer_assignment_opt_in.forEach(({ assignment }) => {
            assignment.start_dt = DateUtils.utcToGmt8(assignment.start_dt);
            assignment.end_dt = DateUtils.utcToGmt8(assignment.end_dt);
          });
          this.volunteerOptedInAssignments = data.volunteer_assignment_opt_in;
        },
      },
      volunteer_pending_assignments: {
        query: volunteerPendingAssignmentsQuery,
        variables() {
          return {
            volunteer_id: this.volunteer.id,
            account_id: this.volunteer.account_id,
          };
        },
        result({ data }) {
          const { pending_assignments } = data;
          const filtered_assignments = pending_assignments.filter((a) => {
            const { notetaker: isNotetaker, interpreter: isInterpreter } = this.volunteer;
            const { notetaker_required, interpreter_required } = a.event;

            if (notetaker_required && interpreter_required) {
              return notetaker_required === isNotetaker && interpreter_required === isInterpreter;
            } else if (notetaker_required && !interpreter_required) {
              return notetaker_required === isNotetaker;
            } else if (interpreter_required && !notetaker_required) {
              return interpreter_required === isInterpreter;
            } else {
              return true;
            }
          });

          filtered_assignments.forEach((assignment) => {
            assignment.start_dt = DateUtils.utcToGmt8(assignment.start_dt);
            assignment.end_dt = DateUtils.utcToGmt8(assignment.end_dt);
          });
          this.pendingAssignments = filtered_assignments;
        },
      },
    },
  },
};
</script>

<style scoped>
.main {
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

.greyed {
  color: #cbcbcb;
}
</style>
