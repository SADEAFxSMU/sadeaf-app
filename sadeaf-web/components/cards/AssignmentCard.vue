<template>
  <div class="assignment-card">
    <div class="header">
      <div class="title-wrapper">
        <h2 class="title">{{ eventName }}</h2>
        <assignment-status :status="status" />
      </div>
      <el-button v-if="showEdit" :icon="icon" size="mini" @click="$emit('editClick', assignment)" />
    </div>
    <div class="body">
      <div>
        <h4>
          {{ address }}
          <span class="room-number" v-if="roomNumber"> {{ roomNumber }} </span>
        </h4>
      </div>
      <div v-if="showStartDate">
        <h5>
          {{ startDate }}
        </h5>
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
import {DateUtils} from "../../common/date-utils";
export default {
  name: "AssignmentCard",
  components: {AssignmentStatus, StatusIndicator, UserCardHorizontalSmall},
  props: {
    details: {
      type: Object,
      required: true,
    },
    showEdit: {
      type: Boolean,
      default: true,
      required: false
    },
    showStartDate: {
      type: Boolean,
      default: false,
      required: false
    },
    isOptIn: {
      type: Boolean,
      default: false,
      require: false
    },
    toAccept: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  computed: {
    // we need to make a distinction since an opt-in object or assignment object
    // can be passed into this component
    assignment() {
      return this.isOptIn ? this.details.assignment : this.details;
    },
    eventName() {
      console.log(this.details);
      return this.assignment.event.name;
    },
    hasVolunteerAssigned() {
      return this.assignment.volunteer && this.assignment.volunteer.account;
    },
    volunteer() {
      return this.assignment.volunteer;
    },
    status() {
      return this.isOptIn ? this.details.status : this.assignment.status;
    },
    address() {
      const { address_line_one, address_line_two } = this.assignment;
      return address_line_one + (address_line_two ? ', ' + address_line_two : '');
    },
    roomNumber() {
      return this.assignment.room_number;
    },
    startDate() {
      return DateUtils.humanReadableDt(this.assignment.start_dt);
    },
    icon() {
      return this.toAccept ? "el-icon-check" : "el-icon-edit";
    }
  }
};
</script>

<style scoped>
.assignment-card {
  background: white;
  border-radius: 6px;
  box-shadow: inset 2px 2px 6px #d5dbe9;
  margin: 8px;
  padding: 16px;
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

