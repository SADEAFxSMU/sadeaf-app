<template>
  <div class="page">
    <div class="service-requests">
      <super-table title="Service Requests"
                   :table-data="tableData"
                   :table-columns="tableColumns"/>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import SuperTable from "../../components/tables/SuperTable";
import NotetakersCell from "../../components/tables/custom-columns/NotetakersCell";
import StatusCell from "../../components/tables/custom-columns/StatusCell";

export default {
  name: "index",
  components: {
    SuperTable,
  },

  data() {
    return {
      assignment: null,
      search: null,
      tableColumns: [
        { name: 'client', label: 'Client', type: 'string', width: 120 },
        {
          name: 'status',
          label: 'Status',
          type: 'custom',
          custom: StatusCell,
          width: 120
        },
        { name: 'date', label: 'Date', type: 'datetime', width: 150 },
        { name: 'event', label: 'Event', type: 'string', width: 250 },
        { name: 'location', label: 'Location', type: 'string', width: 250 },
        {
          name: 'notetakers',
          label: 'Note-takers',
          type: 'custom',
          custom: NotetakersCell,
          width: 400,
        },
      ],
    }
  },
  apollo: {
    assignment: {
      query: gql`query {
        assignment {
          address_line_one
          postal
          room_number
          status
          start_dt
          volunteer {
            account {
              name
            }
          }
          event {
            name
            client {
              account {
                name
              }
            }
          }
        }
      }`
    }
  },
  computed: {
    /**
     * Mapping graphql `event` query result to tableData
     */
    tableData() {
      const data = [];
      if (this.assignment) {
        for (const assignment of this.assignment) {
          data.push({
            client: assignment.event.client.account.name,
            status: assignment.status,
            date: assignment.start_dt,
            event: assignment.event.name,
            location: assignment.address_line_one + ' [' + assignment.room_number + ']',
            notetakers: [{ name: assignment.volunteer.account.name }]
          })
        }
      }
      return data;
    }
  }
}
</script>

<style scoped>
.page {
}

.service-requests {
  padding-top: 20px;
}
</style>
