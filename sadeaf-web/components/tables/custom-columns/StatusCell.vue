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
    status: {
      type: String,
      required: true,
    }
  },
  computed: {
    type() {
      return statusToTypeMapping[status];
    }
  }
};
</script>

<style scoped>

</style>
