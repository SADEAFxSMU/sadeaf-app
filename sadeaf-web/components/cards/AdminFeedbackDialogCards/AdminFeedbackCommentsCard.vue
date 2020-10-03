<template>
  <el-card
    header="Feedback Comments"
    class="comment-card"
  >
    <el-row
      v-for="commentLabel in Object.keys(comments)"
      :key="commentLabel"
      class="comment-row"
    >
      <el-row>
        <el-col class="comment-label">
          <h4>{{ commentLabel }}</h4>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          {{ comments[commentLabel] }}
        </el-col>
      </el-row>
    </el-row>

  </el-card>
</template>

<script>
export default {
  name: 'AdminFeedbackCommentsCard',
  props: {
    comments: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.comment-card {
  .comment-label {
    margin-bottom: 4px;
  }

  .comment-row {
    &:not(:first-child) {
      margin-top: 24px;
    }
  }
}
</style>
