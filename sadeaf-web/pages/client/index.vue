<template>
  <div>
    <client-event-calendar />
    <client-events-table class="client-event-table" />
  </div>
</template>

<script>
import ClientEventsTable from '../../components/tables/ClientEventsTable/index';
import ClientEventCalendar from '../../components/calendars/ClientEventCalendar';
export default {
  name: 'client-home',

  components: {
    ClientEventCalendar,
    ClientEventsTable,
  },

  data() {
    return {
      updateEvent: null,
      createEventDialogVisible: false,
    };
  },

  methods: {
    handleUpsertEventDialogClose() {
      this.createEventDialogVisible = false;
    },
    handleUpsertEventCancel() {
      this.createEventDialogVisible = false;
    },
  },

  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    client() {
      return this.user.client;
    },
    userName() {
      return this.user.name;
    },
    lastUpdatedFormatted() {
      const lastUpdated = this.lastUpdated.toString();
      return lastUpdated.toString().substr(0, lastUpdated.length - 34);
    },
  },
};
</script>

<style scoped>
.client-event-table {
  padding-top: 40px;
}
</style>
