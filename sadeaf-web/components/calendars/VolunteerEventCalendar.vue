<template>
  <div class="main">
    <div class="calendar">
      <el-calendar @input="handleCalendarClick" style="height: 700px">
        <template slot="dateCell" slot-scope="{ date }">
          <h4 :class="{ greyed: isBeforeToday(date) }">{{ date.getDate() }}</h4>

          <div v-if="getMatchedAssignmentsOnDate(date)" class="assignment-cell">
            <div v-for="assignment in getMatchedAssignmentsOnDate(date)" class="body">
              <el-tag size="mini">
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
          v-if="getMatchedAssignmentsOnDate(selectedDate)"
          :label="selectedDate.toDateString() + ' Session'"
          name="acceptedAssignments"
        >
          <div class="assignment-cards">
            <assignment-card
              v-for="assignment in getAssignmentsOnDate(selectedDate)"
              :key="'as-' + assignment.id"
              :show-cancel="true"
              :details="assignment"
              @editClick="cancelMatchedAssignment"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Available Assignments" name="pendingAssignments">
          <div>
            <assignment-card
              v-for="assignment in lastestPendingAssignmentsFromHasura"
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
  query($volunteer_id: Int!) {
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

    pendingAssignments: assignment(
      where: {
        _and: {
          status: { _eq: "PENDING" }
          _not: { volunteer_assignment_opt_ins: { volunteer_id: { _eq: $volunteer_id } } }
        }
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
        purpose
      }
    }
  }
`;

const volunteerOptInQuery = gql`
  query VolunteerOptIns($volunteer_id: Int!) {
    volunteer_assignment_opt_in(where: { volunteer_id: { _eq: $volunteer_id } }) {
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
  mutation cancelAssignment($assignment_id: Int!) {
    update_assignment_by_pk(pk_columns: { id: $assignment_id }, _set: { status: "PENDING" }) {
      id
      status
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
    isBeforeToday(date) {
      return DateUtils.isBeforeToday(date);
    },
    getMatchedAssignmentsOnDate(date) {
      const assignmentsByDt = this.getAssignmentsOnDate(date);
      let matchedAssignments;

      if (assignmentsByDt) {
        matchedAssignments = _.pickBy(assignmentsByDt, (asg) => asg.status === 'MATCHED');
      }
      // Need to check for empty object since pickBy returns an empty object
      // if there are no matches. Return undefined since {} evaluates to true in js
      // which is undesirable behaviour for v-if
      return _.isEmpty(matchedAssignments) ? undefined : matchedAssignments;
    },
    getAssignmentsOnDate(date) {
      const dateKey = dayjs(date).format('YYYYMMDD');
      return this.assignmentsByDateTime[dateKey];
    },
    handleCalendarClick(date) {
      this.selectedDate = date;
      if (this.getMatchedAssignmentsOnDate(date)) {
        this.tab = 'acceptedAssignments';
      } else {
        this.tab = 'pendingAssignments';
      }
    },
    showAcceptPendingAssignmentDialog(assignment) {
      this.showAcceptDialog = true;
      this.selectedAssignment = assignment;
    },
    handleAcceptDialogClose(status) {
      this.showAcceptDialog = false;
      // only refetch queries when user has accepted an assignment
      // to minimise the number of queries
      if (status === 'accepted') {
        this.$apollo.queries.assignments.refetch();
        this.$apollo.queries.volunteer_assignment_opt_in.refetch();
      }
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
              this.$apollo.queries.assignments.refetch();
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
      this.$confirm('This will un-match you from this assignment. Are you sure?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          this.$apollo
            .mutate({
              mutation: cancelAssignmentQuery,
              variables: {
                assignment_id: assignment.id,
              },
            })
            .then((_) => {
              this.$notify.success('Assignment Cancelled');
              this.tab = 'pendingAssignments';
              this.$apollo.queries.assignments.refetch();
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
    lastestPendingAssignmentsFromHasura() {
      return this.pendingAssignments;
    },
  },
  apollo: {
    assignments: {
      /* TODO(wy): Ideally, this should be a subscribe - need to see what happens after
            auth implementation and how subscriptions factor into the apps
         */
      query: assignmentQuery,
      variables() {
        return {
          volunteer_id: this.volunteer.id,
        };
      },
      result({ data }) {
        data.assignments.forEach(assignment => {
          assignment.start_dt = DateUtils.utcToGmt8(assignment.start_dt);
          assignment.end_dt   = DateUtils.utcToGmt8(assignment.end_dt);
        });
        data.pendingAssignments.forEach(assignment => {
          assignment.start_dt = DateUtils.utcToGmt8(assignment.start_dt);
          assignment.end_dt   = DateUtils.utcToGmt8(assignment.end_dt);
        });
        this.assignments = data.assignments;
        this.pendingAssignments = data.pendingAssignments;
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
          assignment.end_dt   = DateUtils.utcToGmt8(assignment.end_dt);
        });
        this.volunteerOptedInAssignments = data.volunteer_assignment_opt_in;
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
