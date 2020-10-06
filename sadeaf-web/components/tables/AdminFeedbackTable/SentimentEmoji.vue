<template>
  <div>
    <el-row>
      <el-col>
        <span style="font-size: 20px">
          {{ this.getEmoji(sentiment) }}
        </span>
      </el-col>
      <el-col>{{ sentiment }}</el-col>
    </el-row>


  </div>
</template>

<script>
export default {
  name: 'SentimentEmoji',
  props: {
    sentiment: {
      type: String,
      required: true,
    },
  },
  methods: {
    getEmoji(sentiment) {
      switch (sentiment) {
        case 'Very Bad':
          return '🙁';
        case 'Bad':
          return '😕';
        case 'Neutral':
          return '😐';
        case 'Good':
          return '😊';
        case 'Very Good':
          return '😁';
        default:
          return '&#128513';
      }
    },
  },
};
</script>

<style scoped>

</style>
