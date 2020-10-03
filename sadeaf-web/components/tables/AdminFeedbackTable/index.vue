<template>
  <div>
    <BaseTable title="Feedbacks" :rows="tableData" :columns="columns">
      <template v-slot:sentiment="{ row }">
        <SentimentEmoji :sentiment="row.sentiment"></SentimentEmoji>
      </template>

      <template v-slot:edit="{ row }">
        <el-button type="text" size="small" @click="handleOpenFeedback(row)"> View Details </el-button>
      </template>
    </BaseTable>

    <div v-if="this.tableData.length > 0">
      <AdminFeedbackRatingDialog :rowData="this.tableData[0]" />
    </div>

  </div>
</template>

// TODO (Austin): Click on feedback row and generate pop-up modal view of full-feedback
// TODO (Austin): think about what columns sadeaf wants to see for feedback --> Rating columns to see rating per feedback
<script>
import BaseTable from '@/components/tables/BaseTable';
import gql from 'graphql-tag';
import SentimentEmoji from '@/components/tables/AdminFeedbackTable/SentimentEmoji';
import AdminFeedbackRatingDialog from '@/components/dialogs/AdminFeedbackRatingDialog';

const ADMIN_FEEDBACK_SUB_QUERY = gql`
  subscription AdminFeedbackQuery($feedback_given: Int!) {
  feedback(where: {feedback_given: {_eq: $feedback_given}}) {
    id
    live_comments
    notetaker_conduct
    notetaker_punctual
    post_session_comments
    post_session_understanding
    training_privacy_preference
    general_feedback
    live_interaction
    live_information_understanding
    confidentiality_privacy_preference
    training_privacy_preference
    event {
      id
      name
      description
      client {
        id
        account {
          id
          contact
          name
          email
        }
      }
      assignments(order_by: {start_dt: desc}) {
        id
        end_dt
        start_dt
        volunteer {
          id
          account {
            id
            name
          }
        }
      }
    }
    volunteer {
      id
      account {
          id
          contact
          name
          email
      }
    }
  }
}
`;
export default {
  name: 'AdminFeedbackTable',
  components: { AdminFeedbackRatingDialog, SentimentEmoji, BaseTable },
  data() {
    return {
      tableData: [],
      columns: [
        {
          name: 'eventId',
          label: 'Event ID',
        },
        {
          name: 'name',
          label: 'Event',
        },
        {
          name: 'clientName',
          label: 'Client',
        },
        {
          name: 'volunteerName',
          label: 'Volunteer',
        },
        {
          name: 'description',
          label: 'Description',
        },
        {
          name: 'startDate',
          label: 'First Assignment Date',
        },
        {
          name: 'endDate',
          label: 'Last Assignment Date',
        },
        {
          name: 'sentiment',
          label: 'Sentiment',
        },
      ],
    };
  },
  methods: {
    handleOpenFeedback(row) {
      this.$store.commit('adminFeedbackDialog/clickDialog', {
        volunteer: row.volunteer,
        event: row,
      });
    },
    getVolunteerSentiment(row) {
      /**
       *
       * Sentiment is derived as follows:
       * Bad: 20% <
       * Very Bad: >= 20% < 40%
       * Neutral: >= 40% < 60%
       * Good: > 60% < 80%
       * Very Good: >= 80%
       * Gets sentiment for volunteer based on the total score
       */
      const RATING_KEYS = ['notetaker_conduct', 'notetaker_punctual', 'post_session_understanding',
        'live_information_understanding', 'live_interaction'];

      let totalScore = 0;
      RATING_KEYS.forEach(k => {
        totalScore += parseInt(row[k]);
      });

      const MAX_SCORE = 30;
      const percentile = totalScore / MAX_SCORE;
      let sentiment = '';

      if (percentile < 0.20) {
        sentiment = 'Very Bad';
      } else if (percentile >= 0.2 && percentile < 0.4) {
        sentiment = 'Bad';
      } else if (percentile >= 0.4 && percentile < 0.6) {
        sentiment = 'Neutral';
      } else if (percentile >= 0.6 && percentile < 0.8) {
        sentiment = 'Good';
      } else if (percentile >= 0.8) {
        sentiment = 'Very Good';
      }
      return sentiment;
    },
    closeEventFeedbackForm() {
      this.$store.commit('feedbackForm/hideForm');
      this.eventSelected = {};
    },
    mapResponseToRows(feedbacksGiven) {
      const rows = [];
      if (feedbacksGiven) {
        feedbacksGiven.forEach((feedback) => {
          const { event, volunteer } = feedback;
          const sentiment = this.getVolunteerSentiment(feedback);
          const { notetaker_conduct, notetaker_punctual, post_session_understanding,
            live_information_understanding, live_interaction } = feedback;

          const volunteerAssignments = event.assignments.filter((a) => a.volunteer.id === volunteer.id);
          rows.push({
            ...feedback,
            sentiment,
            feedback_id: feedback.id,
            id: event.id + volunteer.account.name,
            eventId: event.id,
            quotation: event.quotation,
            purpose: event.purpose,
            client: event.client,
            startDate: new Date(volunteerAssignments[0].start_dt).toLocaleString(),
            endDate: new Date(volunteerAssignments[volunteerAssignments.length - 1].start_dt).toLocaleString(),
            name: event.name,
            description: event.description,
            volunteer: volunteer,
            volunteerName: volunteer.account.name,
            clientName: event.client.account.name,
            assignments: volunteerAssignments,
          });
        });
      }
      this.tableData = rows;
    },
  },
  apollo: {
    $subscribe: {
      event: {
        query: ADMIN_FEEDBACK_SUB_QUERY,
        variables() {
          return {
            feedback_given: 1,
          };
        },
        result({ data }) {
          this.mapResponseToRows(data.feedback);
        },
      },
    },
  },
};
</script>

<style scoped>

</style>
