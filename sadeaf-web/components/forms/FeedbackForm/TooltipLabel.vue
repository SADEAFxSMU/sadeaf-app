<template>
  <div style="padding-bottom: 10px">
    <span style="color: indianred"> * </span> {{ this.title }}
    <el-tooltip :content="tooltipInfo">
      <i style="color: lightgrey" class="el-icon-info" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'tooltip-label',
  props: {
    title: {
      type: String,
      required: true,
    },
    tooltipInfo: {
      type: String,
      required: true,
    }
  },
};
</script>

<style scoped>

</style>
