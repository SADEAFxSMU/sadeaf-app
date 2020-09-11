<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="assignment in assignments"
                        :key="'assignment-' + assignment.id"
                        :color="color(assignment)"
                        :timestamp="formatTimestamp(assignment.start_dt) + ' - ' + formatTimestamp(assignment.end_dt)">
        <div class="status-bar">
          <status-indicator :color="color(assignment)"
                            :text="status(assignment)"
                            :show-ball="false" />
          <el-button @click="handleUpdateAssignment(assignment)"
                     icon="el-icon-edit"
                     size="mini"
                     style="margin-left: 4px;" />
        </div>
        <assignment-card :assignment="assignment" />
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import AssignmentCard from "./AssignmentCardSmall";
import StatusIndicator from "../StatusIndicator";
import SadeafCreateAssignmentForm from "../forms/SadeafCreateAssignmentForm";
import { ASSIGNMENT_STATUSES } from "../../common/types/constants";
const {
  OPEN,
  MATCHED,
  COMPLETE,
  CANCELLED,
  URGENT,
  UNKNOWN,
} = ASSIGNMENT_STATUSES;

const STATUS_COLORS = {
  [OPEN]: '#f1b65d',
  [MATCHED]: '#65adff',
  [COMPLETE]: '#59cb7a',
  [CANCELLED]: '#ee5d5d',
  [URGENT]: '#fa4c4c',
  [UNKNOWN]: '#b34ef3',
}

export default {
  name: "AssignmentsTimeline",
  components: {AssignmentCard, StatusIndicator, SadeafCreateAssignmentForm},
  props: {
    event_id: {
      type: Number,
      required: true,
    },
    client: {
      type: Object,
      required: true,
    },
    assignments: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      updateAssignment: null,
      updateAssignmentDialogVisible: false,
    }
  },
  methods: {
    status(assignment) {
      return assignment.status || UNKNOWN;
    },
    hasVolunteerAssigned(assignment) {
      return assignment.volunteer && assignment.volunteer.account;
    },
    color(assignment) {
      return STATUS_COLORS[this.status(assignment)];
    },
    handleUpdateAssignment(assignment) {
      this.$emit('updateAssignment', assignment);
    },
    formatTimestamp(timestamp) {
      return this.$dayjs(timestamp).format('ddd, DD MMM, HH:mm');
    }
  }
};
</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
}
</style>
