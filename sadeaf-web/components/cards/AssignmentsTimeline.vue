<template>
  <div>
    <el-timeline>
      <el-timeline-item v-for="assignment in assignments"
                        :key="'assignment-' + assignment.id"
                        :color="color(assignment)"
                        :timestamp="formatTimestamp(assignment.start_dt) + ' - ' + formatTimestamp(assignment.end_dt)">
        <div class="status-bar">
          <assignment-status :status="assignment.status"
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
import AssignmentStatus from "../AssignmentStatus";
import SadeafCreateAssignmentForm from "../forms/SadeafCreateAssignmentForm";
import { ASSIGNMENT_STATUS_COLORS } from "../../common/types/constants";

export default {
  name: "AssignmentsTimeline",
  components: {
    AssignmentCard,
    AssignmentStatus,
    SadeafCreateAssignmentForm
  },
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
    hasVolunteerAssigned(assignment) {
      return assignment.volunteer && assignment.volunteer.account;
    },
    handleUpdateAssignment(assignment) {
      this.$emit('updateAssignment', assignment);
    },
    formatTimestamp(timestamp) {
      return this.$dayjs(timestamp).format('ddd, DD MMM, HH:mm');
    },
    color(assignment) {
      return ASSIGNMENT_STATUS_COLORS[assignment.status];
    },
  }
};
</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
}
</style>
