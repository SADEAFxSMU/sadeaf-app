<template>
  <div>
    <AdminFeedbackTable></AdminFeedbackTable>
  </div>
</template>

<script>
import AdminFeedbackTable from '@/components/tables/AdminFeedbackTable/index';
import downloadCsv from 'vue-json-csv';

export default {
  components: { AdminFeedbackTable },
  name: 'admin-feedback',
};
</script>
