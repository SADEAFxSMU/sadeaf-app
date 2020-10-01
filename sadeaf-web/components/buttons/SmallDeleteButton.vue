<template>
  <el-button v-on="$listeners" class="small-delete-btn" icon="el-icon-close" size="mini" type="danger" circle />
</template>

<script>
export default {
  name: "SmallDeleteButton",
};
</script>

<style scoped>
.small-delete-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12px;
  width: 12px;
  font-size: 10px;
  text-align: center !important;
  line-height: 8px;
  padding: 4px;
}
</style>
