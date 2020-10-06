<template>
  <el-card class="summary-card">
    <div slot="header" class="clearfix">
      <h2>Event Information</h2>
    </div>
    <el-row v-for="info in information" :key="info.label" class="margin-bottom__sm-not-last">
      <el-row>
        <el-col>
          <h4>{{ info.label }}</h4>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          {{ info.contents }}
        </el-col>
      </el-row>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AdminFeedbackEventInfoCard',
  data() {
    return {
      information: [],
      showAssignmentDialog: false,
    };
  },
  methods: {
    toggleAssignmentDialog() {
      this.showAssignmentDialog = !this.showAssignmentDialog;
    },
  },
  created() {
    const event = this.$store.state.adminFeedbackDialog.event;
    const { assignments } = event;
    const start_dt = assignments.length > 0 ? new Date(assignments[0].start_dt).toDateString() : null;
    const end_dt = assignments.length > 0 ? new Date(assignments[assignments.length - 1].end_dt).toDateString() : null;

    this.information.push({ label: 'Event ID', contents: event.eventId });
    this.information.push({ label: 'Event Name', contents: event.name });
    this.information.push({ label: 'Client', contents: event.client.account.name });
    this.information.push({ label: 'Date Range', contents: `${start_dt} - ${end_dt}` });
    this.information.push({ label: 'Total Assignments', contents: assignments.length });
  },
};
</script>
<style lang="scss" scoped>
.margin-bottom__sm {
  margin-bottom: 8px;

  &-not-last:not(:last-child) {
    margin-bottom: 8px;
  }
}

.summary-card {
}
</style>
