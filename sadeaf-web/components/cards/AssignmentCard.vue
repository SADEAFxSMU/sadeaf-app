<template>
  <div :class="`assignment-card ${type}`">
    <div class="header">
      <div class="title-wrapper">
        <h2 class="title">{{ assignment.event.name }}</h2>
        <assignment-status :status="assignment.status" />
      </div>
      <el-button v-if="!readOnly"
                 icon="el-icon-edit"
                 size="mini"
                 @click="$emit('editClick', assignment)" />
    </div>
    <div class="body">
      <div>
        <h4>
          {{ address }}
          <span class="room-number" v-if="roomNumber"> {{ roomNumber }} </span>
        </h4>
      </div>
      <div class="assigned-volunteer">
        <user-card-horizontal-small v-if="assignment.volunteer"
                                    :user="assignment.volunteer.account"/>
      </div>
    </div>
    <div class="footer">
    </div>
  </div>
</template>

<script>
import UserCardHorizontalSmall from "../user/UserCardHorizontalSmall";
import StatusIndicator from "../StatusIndicator";
import AssignmentStatus from "../AssignmentStatus";
export default {
  name: "AssignmentCard",
  components: {AssignmentStatus, StatusIndicator, UserCardHorizontalSmall},
  props: {
    assignment: {
      type: Object,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'indent',
      validator: val => ['indent', 'elevate', 'flat'].includes(val),
    }
  },
  computed: {
    hasVolunteerAssigned() {
      return this.assignment.volunteer && this.assignment.volunteer.account;
    },
    volunteer() {
      return this.assignment.volunteer;
    },
    status() {
      return this.assignment.status;
    },
    address() {
      const { address_line_one, address_line_two } = this.assignment;
      return address_line_one + (address_line_two ? ', ' + address_line_two : '');
    },
    roomNumber() {
      return this.assignment.room_number;
    },
  }
};
</script>

<style scoped>
.assignment-card {
  background: white;
  border-radius: 6px;
  margin: 8px;
  padding: 16px;
}
.assignment-card.indent {
  box-shadow: inset 2px 2px 6px #d5dbe9;
}
.assignment-card.elevate {
  box-shadow: 2px 2px 6px 1px #d9dfee;
}
.assignment-card .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.assignment-card .header .title {
  color: #5f5f75;
  font-weight: normal;
  margin-right: 12px;
}
.assignment-card .header .title-wrapper {
  display: flex;
  align-items: center;
}

.assignment-card .body {
  padding: 8px 0 8px 0;
}
.assignment-card .body > * {
  padding: 4px;
}

.assignment-card .body .room-number {
  color: #5f5f75;
  font-weight: normal;
}

.assignment-card .body .assigned-volunteer {

}

.assignment-card .footer {
}
</style>

