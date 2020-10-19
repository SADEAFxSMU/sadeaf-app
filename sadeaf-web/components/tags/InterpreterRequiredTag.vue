<template>
  <el-tag type="success" :size="size"> {{ label }} </el-tag>
</template>

<script>
export default {
  name: 'InterpreterRequiredTag',
  props: {
    label: {
      required: false,
      default: 'Interpretation',
      type: String,
    },
    size: {
      required: false,
      default: 'small',
      type: String,
    },
  },
};
</script>

<style scoped></style>
