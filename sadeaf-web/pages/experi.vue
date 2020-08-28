<template>
  <div>
    <crud-table schema="event"
                role="client"
                expandable-rows
                :columns="columns"
                @create="handleCreate"
                @update="handleUpdate"
                @delete="handleDelete">
      <template v-slot:expanded="{ row }">
        <div style="background: white; box-shadow: inset 2px 2px 10px #d4e0ec; padding: 18px; border-radius: 6px; overflow: hidden;">
          <pre> {{ JSON.stringify(row, null, 2) }}</pre>
        </div>
      </template>
      <template v-slot:purpose="{ row }">
        <h1>{{ row.purpose }}</h1>
      </template>
      <template v-slot:assignments="{ row }">
        <div>
          <h4>
            assignment
          </h4>
        </div>
      </template>
    </crud-table>
  </div>
</template>

<script>
import CrudTable from "../components/tables/CrudTable";
import StatusCell from "../components/tables/custom-columns/StatusCell";

export default {
  name: "experi",
  components: { StatusCell, CrudTable },
  data() {
    return {
      columns: [
        {
          name: 'client_id',
          label: 'Client',
          display: false,
          order: 0,
          editable: false
        },
        {
          name: 'name',
          label: 'Event Name',
          order: 1,
          width: 250
        },
        {
          name: 'assignments',
          label: 'Count',
          width: 100,
          order: 2,
          editable: false
        },
        {
          name: 'status',
          label: 'Status',
          type: 'enum',
          enum: ['PENDING', 'COMPLETE', 'LIVE'],
          editable: false,
          order: 3,
          width: 120
        },
        {
          name: 'dateRange',
          label: 'Date Range',
          type: 'custom',
          width: 150
        },
        {
          name: 'volunteers',
          label: 'Volunteers',
          type: 'custom',
          width: 400,
        },
      ]
    }
  },
  methods: {
    handleCreate() {
      console.log('Created!')
    },
    handleUpdate() {

    },
    handleDelete() {

    }
  }
};
</script>

<style scoped>

</style>
