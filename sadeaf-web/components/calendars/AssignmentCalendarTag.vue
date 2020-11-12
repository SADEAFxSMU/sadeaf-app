<template>
  <el-tag size="mini" :type="type" class="a-cal-tag">
    {{ eventName }}
  </el-tag>
</template>

<script>
import { ASSIGNMENT_STATUSES } from '../../common/types/constants';

const elTagTypeByAssignmentStatus = {
  [ASSIGNMENT_STATUSES.PENDING]: 'warning',
  [ASSIGNMENT_STATUSES.MATCHED]: 'primary',
  [ASSIGNMENT_STATUSES.OPTED_IN]: 'primary',
  [ASSIGNMENT_STATUSES.COMPLETE]: 'success',
  [ASSIGNMENT_STATUSES.CANCELLED]: 'danger',
  [ASSIGNMENT_STATUSES.OPTED_OUT]: 'danger',
};

export default {
  name: 'AssignmentCalendarTag',
  props: {
    eventName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      validator: (val) => val in ASSIGNMENT_STATUSES,
    },
  },
  computed: {
    type() {
      return elTagTypeByAssignmentStatus[this.status] || 'info';
    },
  },
};
</script>

<style scoped>
.a-cal-tag {
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  overflow: hidden;
}
</style>
