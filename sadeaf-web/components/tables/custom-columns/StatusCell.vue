<template>
  <el-tag :type="type">
    {{ status }}
  </el-tag>
</template>

<script>

const statusToTypeMapping = {
  PENDING: 'danger',
  LIVE: 'primary',
  COMPLETE: 'success',
}

export default {
  name: "StatusCell",
  props: {
    row: {
      type: Object,
      required: true,
    }
  },
  computed: {
    status() {
      return this.row.status;
    },
    type() {
      return statusToTypeMapping[this.row.status];
    }
  }
};
</script>

<style scoped>

</style>
