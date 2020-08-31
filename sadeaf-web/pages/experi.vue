<template>
  <div>
    <!--
      Table columns and dialog will be automatically populated
      based on schema.role.operation permissions.
      E.g. Client can only view X, Y, Z columns of Assignment schema
    -->
    <crud-table :schema="schema"
                :title="schema.toUpperCase()"
                :role="role"
                :depth="2"
                expandable-rows>
      <template v-slot:expanded="{ row }">
        <div class="expanded-row" style="">
          <pre> {{ JSON.stringify(row, null, 2) }}</pre>
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
  components: { CrudTable },
  data() {
    return {
      schema: 'assignment',
      role: 'client', // some fields should be hidden now
      // columns: [
      //   {
      //     name: 'client_id',
      //     label: 'Client',
      //     display: false,
      //     order: 0,
      //     editable: false
      //   },
      //   {
      //     name: 'name',
      //     label: 'Event Name',
      //     order: 1,
      //     width: 250
      //   },
      //   {
      //     name: 'assignments',
      //     label: 'Count',
      //     width: 100,
      //     order: 2,
      //     editable: false
      //   },
      //   {
      //     name: 'status',
      //     label: 'Status',
      //     type: 'enum',
      //     enum: ['PENDING', 'COMPLETE', 'LIVE'],
      //     editable: false,
      //     order: 3,
      //     width: 120
      //   },
      //   {
      //     name: 'dateRange',
      //     label: 'Date Range',
      //     type: 'custom',
      //     width: 150
      //   },
      //   {
      //     name: 'volunteers',
      //     label: 'Volunteers',
      //     type: 'custom',
      //     width: 400,
      //   },
      // ]
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
.expanded-row {
  background: white;
  box-shadow: inset 2px 2px 10px #d4e0ec;
  padding: 18px;
  border-radius: 6px;
  overflow: hidden;
}
</style>
