<template>
  <div class="main">
    <div class="calendar">
      <el-calendar @input="handleCalendarClick" style="height: 700px;">
        <template slot="dateCell"
                  slot-scope="{date}">
          <h4 :class="{ 'greyed': isBeforeToday(date) }">{{ date.getDate() }}</h4>

          <div v-if="getAssignmentsOnDate(date)" class="assignment-cell">
            <div v-for="assignment in getAssignmentsOnDate(date)"
                 class="body">
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
        <el-tab-pane v-if="getAssignmentsOnDate(selectedDate)"
                     :label="selectedDate.toDateString() + ' Session'"
                     name="acceptedAssignments">
          <div class="assignment-cards">
            <assignment-card v-for="assignment in getAssignmentsOnDate(selectedDate)"
                             :key="'as-' + assignment.id"
                             :show-edit="false"
                             :details="assignment"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Available Assignments" name="pendingAssignments">
          <div>
            <assignment-card v-for="assignment in lastestPendingAssignmentsFromHasura"
                             :key="'pend-as-' + assignment.id"
                             :details="assignment"
                             :show-start-date="true"
                             :to-accept="true"
                             @editClick="showAcceptPendingAssignmentDialog"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Opt-In History" name="optInHistory">
          <div>
            <div v-if="volunteerOptedInAssignments.length === 0">
              <span>You haven't opted in for any assignments!</span>
            </div>
            <assignment-card v-for="assignment in volunteerOptedInAssignments"
                             :key="'optin-as-' + assignment.id"
                             :details="assignment"
                             :show-edit="false"
                             :is-opt-in="true"
                             :show-start-date="true"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <accept-assignment-details-dialog
      v-if="showAcceptDialog"
      :is-visible="showAcceptDialog"
      :assignment="selectedAssignment"
      @onClose="handleAcceptDialogClose"/>
  </div>
</template>

<script>
  import {DateUtils} from "../../common/date-utils";
  import gql from "graphql-tag";
  import dayjs from "dayjs";
  import AssignmentCard from "../cards/AssignmentCard";
  import AcceptAssignmentDetailsDialog from "../dialogs/AcceptAssignmentDetailsDialog";

  const assignmentQuery = gql`
    query($volunteer_id: Int!) {
      assignments: assignment(where: {volunteer_id: {_eq: $volunteer_id}}) {
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
        honorarium_amount
      }

    pendingAssignments: assignment(
        where: {
          _and: [
            {status: {_eq: "PENDING"}},
            {_not: {volunteer_assignment_opt_ins: {volunteer_id: {_eq: $volunteer_id}}}}
          ]
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
      honorarium_amount
    }
  }`

  const volunteerOptInQuery = gql`
    query VolunteerOptIns($volunteer_id: Int!) {
      volunteer_assignment_opt_in(where: {volunteer_id: {_eq: $volunteer_id}}){
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
  `

  export default {
    name: "VolunteerEventCalendar",
    components: {AcceptAssignmentDetailsDialog, AssignmentCard},
    data() {
      return {
        assignments: [],
        pendingAssignments: [],
        selectedDate: null,
        tab: "pendingAssignments",
        showAcceptDialog: false,
        selectedAssignment: undefined,
        volunteerOptedInAssignments: []
      }
    },
    methods: {
      isBeforeToday(date) {
        return DateUtils.isBeforeToday(date);
      },
      getAssignmentsOnDate(date) {
        const dateKey = dayjs(date).format('YYYYMMDD');
        return this.assignmentsByDateTime[dateKey];
      },
      handleCalendarClick(date) {
        this.selectedDate = date;
        if (this.getAssignmentsOnDate(date)) {
          this.tab = "acceptedAssignments"
        } else {
          this.tab = "pendingAssignments"
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
      }
    },
    computed: {
      assignmentsByDateTime() {
        return DateUtils.groupAssignmentsByDateTime(this.assignments);
      },
      lastestPendingAssignmentsFromHasura() {
        return this.pendingAssignments;
      }
    },
    apollo: {
      assignments: {
        /* TODO(wy): Ideally, this should be a subscribe - need to see what happens after
            auth implementation and how subscriptions factor into the apps
         */
        query: assignmentQuery,
        variables() {
          return {
            volunteer_id: this.$store.state.auth.user.volunteer.id
          }
        },
        result({data}) {
          this.assignments = data.assignments;
          this.pendingAssignments = data.pendingAssignments;
        }
      },
      volunteer_assignment_opt_in: {
        query: volunteerOptInQuery,
        variables() {
          return {
            volunteer_id: this.$store.state.auth.user.volunteer.id
          }
        },
        result({data}) {
          this.volunteerOptedInAssignments = data.volunteer_assignment_opt_in;
        }
      }
    }
  }
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
