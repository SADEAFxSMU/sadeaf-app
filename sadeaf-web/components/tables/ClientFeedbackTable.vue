<template>
  <div>
    <BaseTable title="Event Feedback"
               :rows="tableData"
               :columns="columns"
               expandable-rows
    >
      <template v-slot:volunteers="{row}">
        <volunteers-cell :volunteers="row.volunteer"
                         v-if="row.volunteer && row.volunteer.length > 0" />
      </template>

      <template v-slot:expanded="{ row }">
        <div class="expanded-row">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <h2 style="opacity: 0.5; margin-right: 8px;">Assignments</h2>
          </div>
          <!-- Show assignments as timeline -->
          <assignments-timeline :event_id="row.eventId"
                                :client="row.client"
                                :assignments="row.assignments"
                                :edit-button="false"
          />
        </div>
      </template>

      <template v-slot:edit="{row}">
        <el-button
          size="small"
          type="primary"
          @click="handleEventFeedback(row)">
          Feedback
        </el-button>
      </template>
    </BaseTable>

    <el-dialog
      width="70%"
      :visible="formVisible"
      @close="closeEventFeedbackForm"
      destroy-on-close
    >
      <feedback-form
        :feedbackVolunteer="feedbackVolunteer"
        :eventSelected="eventSelected"
      />
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from './BaseTable';
import gql from 'graphql-tag';
import VolunteersCell from '@/components/tables/custom-columns/VolunteersCell';
import FeedbackForm from '@/components/forms/FeedbackForm/FeedbackForm';
import AssignmentsTimeline from '@/components/cards/AssignmentsTimeline';
import volunteer from '@/components/navbar/volunteer';

const FEEDBACK_SUBSRCRIBE_QUERY = gql`subscription ClientCompletedEventsSubscription($client_account_id: Int!, $feedback_given: Int!) {
          feedback(where: {event: {client: {account_id: {_eq: $client_account_id}}}, feedback_given: {_eq: $feedback_given}}) {
            id
            event {
              id
              name
              description
              client {
                id
                account {
                  id
                  name
                  email
                }
              }
              assignments(order_by: {start_dt: desc}) {
                id
                address_line_one
                address_line_two
                end_dt
                start_dt
                status
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
                name
              }
            }
          }
        }
`;
export default {
  name: 'client-feedback-table',
  components: { FeedbackForm, BaseTable, VolunteersCell, AssignmentsTimeline },
  data() {
    return {
      tableData: [],
      eventSelected: {},
      feedbackVolunteer: {
        'id': 1,
        'account': { 'id': 17, 'name': 'Toh Jin Wee Wayne', '__typename': 'account' },
        '__typename': 'volunteer',
      },
      columns: [
        {
          name: 'name',
          label: 'Event',
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
          name: 'volunteers',
          label: 'Volunteers',
        },
      ],
    };
  },
  computed: {
    formVisible() {
      return this.$store.state.feedbackForm.visible;
    },
    clientAccountId() {
      return this.$store.state.auth.user.id;
    }
  },
  methods: {
    handleEventFeedback(row) {
      this.$store.commit('feedbackForm/clickForm',
        { volunteer: row.volunteer[0], event: row, feedbackId: row.feedback_id });
    },
    closeEventFeedbackForm() {
      this.$store.commit('feedbackForm/hideForm');
      this.eventSelected = {};
    },
    mapResponseToRows(feedbacksToGive) {
      const rows = [];
      if (feedbacksToGive) {
        feedbacksToGive.forEach((feedback) => {
          const { event, volunteer } = feedback;
          const volunteerAssignments = event.assignments.filter(a => a.volunteer.id === volunteer.id);
          rows.push({
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
            volunteer: [volunteer],
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
        query: FEEDBACK_SUBSRCRIBE_QUERY,
        variables() {
          return {
            client_account_id: this.clientAccountId,
            feedback_given: 0,
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
