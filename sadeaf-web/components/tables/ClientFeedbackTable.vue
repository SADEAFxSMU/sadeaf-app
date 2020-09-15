<template>
  <div>
    <BaseTable title="Service Requests"
               :rows="tableData"
               :columns="columns"
               expandable-rows
    >
      <template v-slot:volunteers="{row}">
        <volunteers-cell :volunteers="row.volunteers"
                         v-if="row.volunteers && row.volunteers.length > 0" />
      </template>

      <template v-slot:expanded="{ row }">
        <div class="expanded-row">
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <h2 style="opacity: 0.5; margin-right: 8px;">Assignments</h2>
          </div>
          <!-- Show assignments as timeline -->
          <assignments-timeline :event_id="row.id"
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
      :visible="eventFeedbackFormVisible"
      @close="closeEventFeedbackForm">
      <feedback-form>

      </feedback-form>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from './BaseTable';
import gql from 'graphql-tag';
import VolunteersCell from '@/components/tables/custom-columns/VolunteersCell';
import AssignmentsTimeline from '@/components/assignment/AssignmentsTimeline';
import FeedbackForm from '@/components/forms/FeedbackForm/FeedbackForm';

export default {
  name: 'client-feedback-table',
  components: { FeedbackForm, BaseTable, VolunteersCell, AssignmentsTimeline },
  data() {
    return {
      hello: 'hello',
      tableData: [],
      eventFeedbackFormVisible: true,
      eventSelected: {},
      // TODO(Austin): Get username from vuex store (nuxt auth)
      username: 'xiaoming',
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
  methods: {
    handleEventFeedback(row) {
      this.eventFeedbackFormVisible = true;
      this.eventSelected = row;
    },
    closeEventFeedbackForm() {
      this.eventFeedbackFormVisible = false;
      this.eventSelected = {}
    },
    mapResponseToRows(events) {
      const rows = [];
      if (events) {
        events.forEach(event => {
          if (!event.uncompleted_status) {
            console.log(event.assignments);
            rows.push({
              id: event.id,
              quotation: event.quotation,
              purpose: event.purpose,
              startDate: new Date(event.assignments[0].start_dt).toLocaleString(),
              endDate: new Date(event.assignments[event.assignments.length - 1].start_dt).toLocaleString(),
              name: event.name,
              description: event.description,
              volunteers: event.volunteers.nodes
                .filter(node => node.volunteer)
                .map(node => node.volunteer),
              assignments: event.assignments,
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
