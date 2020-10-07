<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <h2>Volunteer Information</h2>
      </div>
      <el-row class="margin-bottom__sm" justify="start" type="flex" :gutter="16">
        <el-col :span="1.5">
          <el-avatar
            :size="69"
            shape="square"
            :src="
              this.volunteer.account.profile_pic_url ||
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
          />
        </el-col>

        <el-col :span="22">
          <el-row class="margin-bottom__sm">
            <h3>{{ volunteer.account.name }}</h3>
          </el-row>

          <el-row class="margin-bottom__sm">
            <div class="el-icon-phone" />
            <el-divider direction="vertical" />
            {{ volunteer.account.email }}
          </el-row>
          <el-row class="margin-bottom__sm">
            <div class="el-icon-message" />
            <el-divider direction="vertical" />
            {{ volunteer.account.contact }}
          </el-row>
        </el-col>
      </el-row>

      <el-row v-for="infoKey in Object.keys(volunteerInfo)" :key="infoKey" class="margin-bottom__sm">
        <h4>{{ volunteerInfo[infoKey].label }}</h4>
        <span>{{ volunteerInfo[infoKey].value }}</span>
      </el-row>

      <el-row class="margin-bottom__md">
        <h4>Average Rating</h4>
      </el-row>

      <el-row type="flex" justify="space-around">
        <el-col :span="4" v-for="rating in ratings" :key="rating.label">
          <el-row type="flex" align="center" justify="center" class="margin-bottom__sm">
            <rating-progress
              type="circle"
              :value="rating.value"
              :percentage="rating.percentage"
              :width="55"
              :status="rating.status"
            />
          </el-row>
          <el-row type="flex" align="center" justify="center">
            {{ rating.label }}
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { RATING_KEYS } from '@/common/types/constants';
import RatingProgress from '@/components/cards/AdminFeedbackDialogCards/RatingProgress';
import gql from 'graphql-tag';

const FEEDBACK_QUERY = gql`
  query MyQuery($volunteerAccountId: Int!) {
    feedback(where: { volunteer: { account: { id: { _eq: $volunteerAccountId } } } }) {
      post_session_understanding
      live_information_understanding
      live_interaction
      notetaker_conduct
      notetaker_punctual
    }
  }
`;

export default {
  name: 'AdminFeedbackVolunteerCard',
  components: { RatingProgress },
  data() {
    return {
      ratings: [],
      volunteerInfo: {
        // TODO (Austin): See what other info to put in volunteer info card
        feedbackReceived: { label: 'Feedback Received', value: 0 },
      },
    };
  },
  computed: {
    volunteer() {
      return this.$store.state.adminFeedbackDialog.volunteer;
    },
    event() {
      return this.$store.state.adminFeedbackDialog.event;
    },
  },
  methods: {
    async getFeedbackScores() {
      try {
        const r = await this.$apollo.query({
          query: FEEDBACK_QUERY,
          variables: {
            volunteerAccountId: this.volunteer.account.id,
          },
        });
        return r.data.feedback;
      } catch (e) {
        return [];
      }
    },
  },
  async created() {
    const RATING_LABELS = {
      notetaker_conduct: 'Conduct',
      notetaker_punctual: 'Punctuality',
      post_session_understanding: 'Post-Understanding',
      live_information_understanding: 'Live-Understanding',
      live_interaction: 'Interactiveness',
    };

    const result = await this.getFeedbackScores();
    this.volunteerInfo.feedbackReceived.value = result.length;

    let ratings = [];
    RATING_KEYS.forEach((k) => {
      const value = result.reduce((accum, b) => accum + parseInt(b[k]), 0) / result.length;
      ratings.push({
        label: RATING_LABELS[k],
        percentage: (value / 5) * 100,
        status: value > 2.5 ? 'success' : 'exception',
        value: value,
      });
    });
    this.ratings = ratings;
  },
};
</script>

<style scoped lang="scss">
.margin-bottom__md {
  margin-bottom: 16px;
}

.margin-bottom__sm {
  margin-bottom: 8px;

  &-not-last:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
