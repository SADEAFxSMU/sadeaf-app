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
    <transition name="fade">
      <div class="assignment-command-panel" v-if="createServiceRequestFormVisible">
        <el-tabs v-model="tab">
          <el-tab-pane v-if="getAssignmentsOnDate(selectedDate)"
                       :label="selectedDate.toDateString() + ' Session'"
                       name="assignments" >
            <div class="assignment-cards">
              <assignment-card v-for="assignment in getAssignmentsOnDate(selectedDate)"
                               :key="'as-' + assignment.id"
                               :assignment="assignment"
                               @editClick="handleEditAssignmentClick" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="New Service Request" name="request" v-if="isAfterToday(selectedDate)">
            <div>
              <client-create-event-form :date="selectedDate"
                                        @success="createServiceRequestFormVisible = false"
                                        @cancel="handleUpsertEventCancel"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </transition>
    <el-dialog :visible="updateAssignmentDialogVisible"
               @close="handleEditAssignmentCancel"
               :title="`Update ${updateAssignment && updateAssignment.event.name} details`"
               style="border-radius: 4px;">
      <client-upsert-assignment-form :assignment="updateAssignment"
                                     @success="handleEditAssignmentConfirm"
                                     @cancel="handleEditAssignmentCancel" />
    </el-dialog>
  </div>
</template>

<script>
import gql from "graphql-tag";
import ClientCreateEventForm from "../forms/ClientCreateEventForm";
import UserCard from "../user/UserCard";
import AssignmentCard from "../cards/AssignmentCard";
import ClientUpsertAssignmentForm from "../forms/ClientUpsertAssignmentForm";

export default {
  name: "ClientEventCalendar",

  components: {
    ClientUpsertAssignmentForm,
    AssignmentCard,
    UserCard,
    ClientCreateEventForm
  },

  data() {
    return {
      assignments: [],
      assignmentsByDateTime: {},
      selectedDate: null,
      updateEvent: null,
      updateAssignment: null,
      tab: 'assignments',
      createServiceRequestFormVisible: false,
      updateAssignmentDialogVisible: false,
    }
  },

  methods: {
    handleCalendarClick(date) {
      this.selectedDate = date;
      let commandPanelVisible = true;

      if (this.getAssignmentsOnDate(date)) {
        this.tab = 'assignments';
      } else if (this.isAfterToday(date)) {
        this.tab = 'request';
      } else {
        commandPanelVisible = false;
      }

      this.createServiceRequestFormVisible = commandPanelVisible;
    },

    handleEditAssignmentClick(assignment) {
      this.updateAssignment = assignment;
      this.updateAssignmentDialogVisible = true;
    },

    handleEditAssignmentConfirm() {
      this.updateAssignment = null;
      this.updateAssignmentDialogVisible = false;
    },

    handleEditAssignmentCancel() {
      this.updateAssignmentDialogVisible = false;
    },

    handleUpsertEventDialogClose() {
      this.createServiceRequestFormVisible = false;
    },

    handleUpsertEventCancel() {
      this.createServiceRequestFormVisible = false;
    },

    getAssignmentsOnDate(date) {
      const dateKey = this.$dayjs(date).format('YYYYMMDD');
      return this.assignmentsByDateTime[dateKey];
    },
    isBeforeToday(date) {
      // Necessary to set h, m and s to 00:00:00
      const today = new Date(new Date().toDateString());
      return date < today;
    },
    isAfterToday(date) {
      const today = new Date(new Date().toDateString());
      return date > today;
    },
  },

  computed: {
    client() {
      return this.$store.state.auth.user.client;
    }
  },

  apollo: {
    $subscribe: {
      assignments: {
        query: gql`subscription AssignmentsSubscription($client_id: Int!) {
          assignments: assignment(
            where: { event: { client_id: { _eq: $client_id }}}
            order_by: { start_dt: asc }
          ) {
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
            }
            volunteer {
              id
              account {
                id
                name
              }
            }
          }
        }`,
        variables() {
          return {
            client_id: this.client.id
          }
        },
        skip() {
          return !this.client;
        },
        result({ data }) {
          this.assignments = data.assignments;

          const assignmentsByDateTime = {};
          data.assignments.forEach(assignment => {
            const [dateKey, timeKey] = this.$dayjs(assignment.start_dt).format('YYYYMMDD HH:mm').split(' ');
            if (!assignmentsByDateTime.hasOwnProperty(dateKey)) {
              assignmentsByDateTime[dateKey] = {};
            }
            assignmentsByDateTime[dateKey][timeKey] = assignment;
          });
          this.assignmentsByDateTime = assignmentsByDateTime;
        }
      }
    }
  }
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

.assignment-cards {
}

.fade-enter-active, .fade-leave-active {
  flex: 1;
  transition: flex 0.3s;
}
.fade-enter, .fade-leave-to {
  flex: 0;
}

.greyed {
  color: #cbcbcb;
}
</style>
