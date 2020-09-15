<template>
    <el-radio-group v-model="valueSelected" @change="onChangeRadio">
      <el-radio
        v-for="rating in availableRatings"
        :label="rating.label"
      >
        {{ rating.title }}
      </el-radio>
    </el-radio-group>
</template>

<script>
export default {
  name: 'feedback-radio-group',
  data() {
    return { valueSelected: '' };
  },
  props: {
    formKey: {
      type: String,
      required: true
    },
    availableRatings: {
      default: () => ([
        { title: 'Strongly Disagree', label: 1 },
        { title: 'Disagree', label: 2 },
        { title: 'Neutral', label: 3 },
        { title: 'Agree', label: 4 },
        { title: 'Strongly Agree', label: 5 },
      ]),
      type: Array,
    },
  },
  methods: {
    onChangeRadio(e) {
      this.$emit('clicked', { value: e, formKey: this.formKey });
    },
  },
};
</script>

<style scoped>

</style>
