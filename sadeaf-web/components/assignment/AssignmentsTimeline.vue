<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="assignment in assignments"
                        :color="color(assignment)"
                        :timestamp="assignment.start_dt + ' - ' + assignment.end_dt">
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
import AssignmentCard from "./AssignmentCard";
import StatusIndicator from "../StatusIndicator";
import SadeafCreateAssignmentForm from "../forms/SadeafCreateAssignmentForm";

const OPEN = 'OPEN';
const MATCHED = 'MATCHED';
const COMPLETE = 'COMPLETE';
const CANCELLED = 'CANCELLED';
const URGENT = 'URGENT';
const UNKNOWN = 'UNKNOWN';
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
