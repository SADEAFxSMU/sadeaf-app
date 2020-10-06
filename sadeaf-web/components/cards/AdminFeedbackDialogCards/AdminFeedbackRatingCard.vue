<template>
  <el-card
    class="rating-card"
  >
    <div slot="header" class="clearfix">
      <h2>Rating for Event</h2>
    </div>
    <el-row
      v-for="ratingLabel in Object.keys(ratings)"
      :key="ratingLabel"
      type="flex"
      justify="start"
      class="rating-row"
    >
      <el-col
        :span="12"
      >
        <h4>
          {{ ratingLabel }}
        </h4>
      </el-col>
      <el-col
        :span="12"
      >
        <el-rate
          v-model="ratings[ratingLabel]"
          disabled
          show-score
        >
        </el-rate>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'AdminFeedbackRatingCard',
  props: {
    ratings: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.rating-card {
  & .rating-row:not(:first-child) {
    margin-top: 8px;
  }
}
</style>
