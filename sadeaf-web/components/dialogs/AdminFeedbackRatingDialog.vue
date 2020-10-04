<template>
  <el-dialog
    :visible="this.$store.state.adminFeedbackDialog.visible"
    @close="this.closeDialog"
    width="65%"
  >
    <el-row class="margin-bottom__md">
      <AdminFeedbackVolunteerCard />
    </el-row>

    <el-row :gutter="16" type="flex" class="margin-bottom__md">
      <el-col :span="12">
        <AdminFeedbackEventInfoCard />
      </el-col>

      <el-col :span="12">
        <AdminFeedbackRatingCard style="min-height: 100%" :ratings="ratings" />
      </el-col>
    </el-row>

    <el-row class="margin-bottom__md">
      <AdminFeedbackCommentsCard :comments="comments" />
    </el-row>

  </el-dialog>
</template>

<script>

import { RATING_KEYS } from '@/common/types/constants';
import AdminFeedbackEventInfoCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackEventInfoCard';
import AdminFeedbackRatingCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackRatingCard';
import AdminFeedbackCommentsCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackCommentsCard';
import AdminFeedbackVolunteerCard from '@/components/cards/AdminFeedbackDialogCards/AdminFeedbackVolunteerCard';
import _ from 'lodash';

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
  methods: {
    closeDialog() {
      this.$store.commit('adminFeedbackDialog/hideDialog');
    },
  },
  computed: {
    ratings() {
      let ratings = {};

      RATING_KEYS.forEach(k => {
        const label = _.startCase(k);
        ratings[label] = parseInt(this.rowData[k]);
      });

      return ratings;
    },
    comments() {
      const COMMENT_KEYS = ['live_comments', 'post_session_comments', 'general_feedback'];

      let comments = {};

      COMMENT_KEYS.forEach(k => {
        const label = _.startCase(k);
        comments[label] = (this.rowData[k] && this.rowData[k].length > 0) ? this.rowData[k] : 'No Comments.';
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
