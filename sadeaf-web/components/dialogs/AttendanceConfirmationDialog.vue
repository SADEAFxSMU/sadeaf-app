<template>
  <el-dialog :visible="isVisible" title="Attendance Confirmation" @close="$emit('onClose')">
    <div style="padding-bottom: 30px">
      <h4>Confirming attendance for {{ assignment.event.name }}</h4>
      <p>Event Duration: {{ eventDuration() }} hours</p>
    </div>
    <div class="button-wrapper" v-if="!isDisputed && !attended">
      <el-button type="danger" @click="disputeAttendance">Dispute Attendance</el-button>
      <el-button type="primary" @click="upsertVolunteerAssignment">Confirm</el-button>
    </div>
    <div v-else-if="isDisputed">
      <DangerZone title="Disputed Assignment">
        The attendance for this event is currently being disputed. An admin will reach out to you soon.
      </DangerZone>
    </div>
    <div v-else-if="attended">You have marked your attendance for this event.</div>
  </el-dialog>
</template>

<script>
import { DateUtils } from '~/common/date-utils';
import gql from 'graphql-tag';
import DangerZone from '@/components/forms/DangerZone';

export const volunteerUpsertAttendanceMutation = gql`
  mutation VolunteerUpsertAssignment($assignment_id: Int!) {
    insert_attendance(
      objects: { assignment_id: $assignment_id, has_dispute: false, attended: true }
      on_conflict: { constraint: attendance_assignment_id_key, update_columns: [] }
    ) {
      affected_rows
    }
  }
`;

// If the attendance already exists, only update the dispute column if it's previously false.
// This is so that if a client disputes the attendance, the volunteer will not overwrite it.
export const volunteerDisputeAttendanceUpsertMutation = gql`
  mutation VolunteerUpsertAssignment($assignment_id: Int!) {
    insert_attendance(
      objects: { assignment_id: $assignment_id, has_dispute: true, attended: false }
      on_conflict: {
        constraint: attendance_assignment_id_key
        update_columns: [has_dispute]
        where: { has_dispute: { _eq: false } }
      }
    ) {
      affected_rows
    }
  }
`;

export const assignmentAttendanceSubscription = gql`
  subscription AssignmentAttendanceSubscription($assignment_id: Int!) {
    attendance(where: { assignment_id: { _eq: $assignment_id } }) {
      id
      has_dispute
      attended
    }
  }
`;

export default {
  name: 'AcceptAttendanceDialog',
  components: { DangerZone },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    assignment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isDisputed: false,
      attended: false,
    };
  },
  methods: {
    eventDuration() {
      return DateUtils.differenceInHours(this.assignment.start_dt, this.assignment.end_dt);
    },
    upsertVolunteerAssignment() {
      this.$apollo
        .mutate({
          mutation: volunteerUpsertAttendanceMutation,
          variables: {
            assignment_id: this.assignment.id,
          },
        })
        .then((_) => {
          this.$notify.success({ title: 'Success', message: 'Attendance Marked!' });
        })
        .catch((e) => {
          console.error(e);
          this.$notify.error({ title: 'Error', message: 'Something went wrong with marking your attendance' });
        });
    },
    disputeAttendance() {
      this.$apollo
        .mutate({
          mutation: volunteerDisputeAttendanceUpsertMutation,
          variables: {
            assignment_id: this.assignment.id,
          },
        })
        .then((_) => {
          this.$notify.success({
            title: 'Success',
            message: 'Attendance disputed. An admin will get back to you soon.',
          });
        })
        .catch((e) => {
          console.error(e);
          this.$notify.error({ title: 'Error', message: 'Something went wrong with disputing your attendance' });
        });
    },
  },
  apollo: {
    $subscribe: {
      attendance: {
        query: assignmentAttendanceSubscription,
        variables() {
          return {
            assignment_id: this.assignment.id,
          };
        },
        result({ data: { attendance } }) {
          if (attendance.length === 0) {
            return;
          }
          this.isDisputed = attendance[0].has_dispute;
          this.attended = attendance[0].attended;
        },
      },
    },
  },
};
</script>

<style scoped>
.button-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
