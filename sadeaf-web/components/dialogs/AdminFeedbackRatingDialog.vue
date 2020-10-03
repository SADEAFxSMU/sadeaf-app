<template>
  <el-dialog
    :visible="true"
  >
    <el-row class="margin-bottom__md" :gutter="16">
      <el-col :span="12">
        <AdminFeedbackEventInfoCard />
      </el-col>

      <el-col :span="12">
        <AdminFeedbackVolunteerCard />
      </el-col>
    </el-row>

    <el-row class="margin-bottom__md">
      <AdminFeedbackRatingCard :ratings="ratings" />
    </el-row>

    <el-row class="margin-bottom__md">
      <AdminFeedbackCommentsCard :comments="comments" />
    </el-row>

  </el-dialog>
</template>

<script>

import { StringUtils } from '@/common/string-utils';
import { RATING_KEYS } from '@/common/types/constants';
import AdminFeedbackEventInfoCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackEventInfoCard';
import AdminFeedbackRatingCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackRatingCard';
import AdminFeedbackCommentsCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackCommentsCard';
import AdminFeedbackVolunteerCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackVolunteerCard';

export default {
  name: 'AdminFeedbackRatingDialog',
  components: {
    AdminFeedbackVolunteerCard,
    AdminFeedbackCommentsCard,
    AdminFeedbackRatingCard,
    AdminFeedbackEventInfoCard,
  },
  props: {
    rowData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ratings() {
      let ratings = {};

      RATING_KEYS.forEach(k => {
        const label = StringUtils.toTitleCase(k.replace(/_/g, ' '));
        ratings[label] = parseInt(this.rowData[k]);
      });

      return ratings;
    },
    comments() {
      const COMMENT_KEYS = ['live_comments', 'post_session_comments', 'general_feedback'];

      let comments = {};

      COMMENT_KEYS.forEach(k => {
        const label = StringUtils.toTitleCase(k.replace(/_/g, ' '));
        comments[label] = this.rowData[k];
      });

      return comments;
    },
  },
};
</script>

<style lang="scss" scoped>
.margin-bottom__md {
  margin-bottom: 16px;
}
</style>
