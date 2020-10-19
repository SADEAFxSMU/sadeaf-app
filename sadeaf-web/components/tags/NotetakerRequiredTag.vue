<template>
  <el-tag :size="size"> {{ label }} </el-tag>
</template>

<script>
export default {
  name: 'NotetakerRequiredTag',
  props: {
    label: {
      required: false,
      default: 'Notetaking',
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
