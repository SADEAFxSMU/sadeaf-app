<template>
  <div>
    <BaseTable :loading="loading" title="Feedbacks" :rows="filteredTableData" :columns="columns">
      <template v-slot:additionalHeaderCols>
        <el-row type="flex" :gutter="8">
          <el-col>
            <el-date-picker
              v-model="downloadDate"
              type="daterange"
              start-placeholder="Assignment Start Date"
              end-placeholder="Assignment End Date"
              @change="handleDateChange"
            />
          </el-col>
          <el-col>
            <download-csv :data="filteredTableData" :fields="downloadColumns" :name="fileName">
              <el-button type="primary"> Export Data</el-button>
            </download-csv>
          </el-col>
        </el-row>
      </template>
      <template v-slot:sentiment="{ row }">
        <SentimentEmoji :sentiment="row.sentiment"></SentimentEmoji>
      </template>

      <template v-slot:edit="{ row }">
        <el-button type="text" size="small" @click="handleOpenFeedback(row)"> View Details</el-button>
      </template>
    </BaseTable>

    <div v-if="selectedRow">
      <AdminFeedbackRatingDialog :rowData="selectedRow" />
    </div>
  </div>
</template>

<script>
// TODO (Austin): think about what columns sadeaf wants to see for feedback --> Rating columns to see rating per feedback

import downloadCsv from 'vue-json-csv';
import BaseTable from '@/components/tables/BaseTable';
import gql from 'graphql-tag';
import SentimentEmoji from '@/components/tables/AdminFeedbackTable/SentimentEmoji';
import AdminFeedbackRatingDialog from '@/components/dialogs/AdminFeedbackRatingDialog';
import { DateUtils } from '@/common/date-utils';
import { RATING_KEYS } from '@/common/types/constants';

const ADMIN_FEEDBACK_SUB_QUERY = gql`
  subscription AdminFeedbackQuery($feedback_given: Int!) {
    feedback(where: { feedback_given: { _eq: $feedback_given } }) {
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
        client {
          id
          account {
            id
            contact
            name
            email
          }
        }
        assignments(order_by: { start_dt: asc }) {
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
          profile_pic_url
          contact
          name
          email
        }
      }
    }
  }
`;

const DOWNLOAD_COLUMNS = [];
export default {
  name: 'AdminFeedbackTable',
  components: { downloadCsv, AdminFeedbackRatingDialog, SentimentEmoji, BaseTable },
  data() {
    return {
      filteredTableData: [],
      downloadDate: null,
      tableData: [],
      selectedRow: null,
      downloadColumns: [
        'feedback_id',
        'post_session_comments',
        'live_comments',
        'additional_comments',
        'eventId',
        'name',
        'clientName',
        'clientAccountId',
        'volunteerName',
        'volunteerAccountId',
        'sentiment',
      ].concat(RATING_KEYS),
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
      loading: true,
    };
  },
  computed: {
    fileName() {
      return this.downloadDate
        ? `${this.downloadDate[0]}_${this.downloadDate[1]}_feedback_data.csv`
        : `feedback_data.csv`;
    },
  },
  methods: {
    handleDateChange() {
      if (!this.downloadDate) {
        return (this.filteredTableData = this.tableData);
      }
      const [startDate, endDate] = this.downloadDate;
      this.filteredTableData = this.tableData.filter((row) => {
        const earliestAssignmentDate = new Date(
          row.rawStartDate.year(),
          row.rawStartDate.month(),
          row.rawStartDate.date()
        );
        const latestAssignmentDate = new Date(row.rawEndDate.year(), row.rawEndDate.month(), row.rawEndDate.date());

        return earliestAssignmentDate >= startDate && latestAssignmentDate <= endDate;
      });
    },
    handleOpenFeedback(row) {
      this.$store.commit('adminFeedbackDialog/clickDialog', {
        volunteer: row.volunteer,
        event: row,
      });
      this.selectedRow = row;
    },
    closeEventFeedbackForm() {
      this.$store.commit('feedbackForm/hideForm');
      this.eventSelected = {};
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
      const RATING_KEYS = [
        'notetaker_conduct',
        'notetaker_punctual',
        'post_session_understanding',
        'live_information_understanding',
        'live_interaction',
      ];

      let totalScore = 0;
      RATING_KEYS.forEach((k) => {
        totalScore += parseInt(row[k]);
      });

      const MAX_SCORE = 30;
      const percentile = totalScore / MAX_SCORE;
      let sentiment = '';

      if (percentile < 0.2) {
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
    mapResponseToRows(feedbacksGiven) {
      const rows = [];
      if (feedbacksGiven) {
        feedbacksGiven.forEach((feedback) => {
          const { event, volunteer } = feedback;
          const sentiment = this.getVolunteerSentiment(feedback);
          const volunteerAssignments = event.assignments.filter((a) => a.volunteer && a.volunteer.id === volunteer.id);
          rows.push({
            ...feedback,
            sentiment,
            feedback_id: feedback.id,
            id: event.id + volunteer.account.name,
            eventId: event.id,
            client: event.client,
            rawStartDate: DateUtils.utcToGmt8(volunteerAssignments[0].start_dt),
            startDate: DateUtils.humanReadableDt(DateUtils.utcToGmt8(volunteerAssignments[0].start_dt)),
            rawEndDate: DateUtils.utcToGmt8(volunteerAssignments[volunteerAssignments.length - 1].start_dt),
            endDate: DateUtils.humanReadableDt(
              DateUtils.utcToGmt8(volunteerAssignments[volunteerAssignments.length - 1].start_dt)
            ),
            name: event.name,
            volunteer: volunteer,
            volunteerName: volunteer.account.name,
            volunteerAccountId: volunteer.account.id,
            clientName: event.client.account.name,
            clientAccountId: event.client.account.id,
            assignments: volunteerAssignments,
          });
        });
      }
      this.tableData = rows;
      this.filteredTableData = this.tableData;
      this.loading = false;
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
