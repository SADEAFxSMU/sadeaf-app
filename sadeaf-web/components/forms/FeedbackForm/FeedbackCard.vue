<template>
  <el-card class="card-margin" shadow="never">
    <el-row>
      <el-col><h4>Volunteer</h4></el-col>
    </el-row>

    <el-row class="row-padding" type="flex" align="middle" justify="start">
      <el-col :span="2">
        <!--        TODO(Austin): Change src to Avatar url once user profile pic column has been pushed to master (Eli)-->
        <el-avatar :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
      </el-col>
      <el-col :span="14">{{ volunteer.account.name }}</el-col>
    </el-row>

    <el-row>
      <el-col><h4>Event Name</h4></el-col>
    </el-row>

    <el-row>
      <el-col>{{ event.name }}</el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "feedback-card",
  computed: {
    volunteer() {
      return this.$store.state.feedbackForm.volunteer;
    },
    event() {
      return this.$store.state.feedbackForm.event;
    },
  },
};
</script>

<style scoped>
.row-padding {
  padding-bottom: 10px;
}

.card-margin {
  margin-bottom: 20px;
}
</style>
