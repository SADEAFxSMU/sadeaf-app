<template>
  <el-card header="Event Information" class="summary-card">
    <el-row v-for="info in information"
            :key="info.label"
            class="margin-bottom__sm-not-last"
    >
      <el-row>
        <el-col>
          <h4> {{ info.label }}</h4>
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
      // TODO: Add props for these
      information: [
        {
          label: 'Event Name',
          contents: 'IS112 - Web Application',
        },
        {
          label: 'Date Range',
          contents: 'March 20, 2020 - September 20, 2020',
        },
        {
          label: 'Date / Time',
          contents: 'April 20th 2020 1630',
        },
        {
          label: 'Client',
          contents: 'Vicky Lim',
        },
      ],
    };
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
