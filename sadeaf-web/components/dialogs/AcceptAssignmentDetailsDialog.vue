<template>
  <el-dialog
    :visible="isVisible"
    title="Event Details"
    @close="closeDialog">

    <div>
      <el-row>
        <el-col :span="4">
          <span class="label">Name</span>
        </el-col>
        <el-col :span="20">{{ assignment.event.name }}</el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="4">
          <span class="label">Description</span>
        </el-col>
        <el-col :span="20">{{ assignment.event.description }}</el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="4">
          <span class="label">Purpose</span>
        </el-col>
        <el-col :span="20">{{ assignment.event.purpose }}</el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="4">
          <span class="label">Address</span>
        </el-col>
        <el-col :span="20">{{ eventAddress }}</el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="4">
          <span class="label">Start Date/Time</span>
        </el-col>
        <el-col :span="20">{{ startDate }}</el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <el-col :span="4">
          <span class="label">End Date/Time</span>
        </el-col>
        <el-col :span="20">{{ endDate }}</el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="optInForAssignment">Accept</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import gql from "graphql-tag";
  import {DateUtils} from "../../common/date-utils";

  export default {
    name: "AcceptAssignmentDetailsDialog",
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      assignment: {
        type: Object,
        required: false
      }
    },
    data() {
      return {}
    },
    methods: {
      closeDialog() {
        this.$emit('onClose');
      },
      // need to await mutation so that parent will only refetch assignment
      // data after mutation is complete
      async optInForAssignment() {
        await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $volunteer_id: Int!,
              $assignment_id: Int!
            ) {
              insert_volunteer_assignment_opt_in_one(object: {
                assignment_id: $assignment_id,
                volunteer_id: $volunteer_id,
                status: "OPTED_IN",
              }) {
                id
                status
                volunteer_id
                assignment_id
              }
            }
          `,
          variables: {
            volunteer_id: this.$store.state.auth.user.volunteer.id,
            assignment_id: this.assignment.id
          }
        }).then(_ => {
          this.$notify.success('Assignment Accepted');
          this.$emit('onClose', 'accepted')
        }).catch((error) => {
          this.$notify.error('Something went wrong with accepting the assignment')
          console.log(error);
          this.closeDialog();
        })
      }
    },
    computed: {
      eventAddress() {
        let asg = this.assignment;
        let addLineTwo = asg.address_line_two ? asg.address_line_two : "";
        return `${asg.address_line_one} ${addLineTwo} s(${asg.postal})`
      },
      startDate() {
        return DateUtils.humanReadableDt(this.assignment.start_dt);
      },
      endDate() {
        return DateUtils.humanReadableDt(this.assignment.end_dt);
      }
    }
  }
</script>

<style scoped>
  .label {
    font-weight: bold;
  }
  div {
    padding-bottom: 10px
  }
</style>
