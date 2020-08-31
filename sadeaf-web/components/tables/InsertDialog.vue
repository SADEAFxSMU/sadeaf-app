<template>
  <el-dialog :title="`Create New ${schema}`" :visible="visible" v-on="$listeners" :modalAppendToBody="false">
    <insert-form :schema="schema" :role="role" />
  </el-dialog>
</template>

<script>
import InsertForm from "../form/InsertForm";
import EditableTabs from "../EditableTabs";

export default {
  name: "InsertDialog",
  components: {EditableTabs, InsertForm},
  props: {
    schema: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      fieldsByKey: {},
      form: {},
    }
  },
};
</script>

<style scoped>

</style>
