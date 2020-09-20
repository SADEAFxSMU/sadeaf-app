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
      @close="closeEventFeedbackForm">
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

export default {
  name: 'client-feedback-table',
  components: { FeedbackForm, BaseTable, VolunteersCell, AssignmentsTimeline },
  data() {
    return {
      hello: 'hello',
      tableData: [],
      eventSelected: {},
      // TODO(Austin): Get username from vuex store (nuxt auth)
      username: 'xiaoming',
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
    }
  },
  methods: {
    handleEventFeedback(row) {
      this.$store.commit('feedbackForm/clickForm',
        { volunteer: row.volunteer[0], event: row });
    },
    closeEventFeedbackForm() {
      this.$store.commit('feedbackForm/hideForm')
      this.eventSelected = {};
    },
    mapResponseToRows(events) {
      const rows = [];
      if (events) {
        events.forEach(event => {
          if (!event.uncompleted_status) {
            event.volunteers.nodes.forEach(({ volunteer }) => {
              const volunteerAssignments = event.assignments.filter(e => e.volunteer.id === volunteer.id);
              rows.push({
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
        });
      }
      this.tableData = rows;
    },
  },
  apollo: {
    $subscribe: {
      event: {
        query: gql`subscription ClientCompletedEventsSubscription($client_username: String!) {
          events: event(where: {client: {account: {username: {_eq: $client_username}}}}, order_by: {assignments_aggregate: {max: {start_dt: desc_nulls_last}}}) {
            id
            name
            uncompleted_status
            description
            purpose
            client {
              id
              account {
                username
                id
                name
                email
              }
            }
            volunteers: assignments_aggregate(distinct_on: volunteer_id) {
              nodes {
                volunteer {
                  id
                  account {
                    id
                    name
                  }
                }
              }
            }
            assignments(order_by: {start_dt: desc}) {
              id
              address_line_one
              address_line_two
              postal
              start_dt
              end_dt
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
        }
      `,
        variables() {
          return {
            client_username: this.username,
          };
        },
        result({ data }) {
          this.mapResponseToRows(data.events);
        },
      },
    },
  },
};
</script>

<style scoped>

</style>
