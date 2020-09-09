<template>
  <div>
    <div class="summary">
      <div class="left">
        <h1>Welcome Back, {{ userName }}</h1>
        <div class="admin-notifs">
          .
        </div>
      </div>
      <div class="service-request-summary">
        <h1>Service Requests</h1>
        <div class="service-request-stats">
          <doughnut-chart :data="eventsSummary"
                          :options="{...chartOptions, legend: false}" />
          <div class="stat-cards">
            <stat-card title="Matched"
                       accent-color="rgba(54,191,255,0.7)"
                       :stat="matched" />
            <stat-card title="Unmatched"
                       accent-color="rgba(158,89,255,0.7)"
                       :stat="unmatched" />
            <div class="timestamp">
              Updated: {{ lastUpdatedFormatted }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <admin-events-table @summary="handleSummaryComputed" />
  </div>
</template>

<script>
import AdminEventsTable from "../../components/tables/AdminEventsTable";
import StatCard from "../../components/StatCard";
import DoughnutChart from "../../components/charts/Doughnut";
export default {
  name: "client-home",
  components: {DoughnutChart, StatCard, AdminEventsTable},
  data() {
    return {
      userName: 'Admin',
      eventsSummary: {},
      matched: 0,
      unmatched: 0,
      lastUpdated: new Date(),
      chartOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  methods: {
    handleSummaryComputed({ matched, unmatched }) {
      this.eventsSummary = {
        labels: ["Matched", "Unmatched"],
        datasets: [
          {
            backgroundColor: ["rgba(54,191,255,0.7)", "rgba(158,89,255,0.7)"],
            borderWidth: 1,
            borderColor: ["rgba(54,191,255,0.7)", "rgba(158,89,255,0.7)"],
            data: [matched, unmatched]
          }
        ]
      };
      this.matched = matched;
      this.unmatched = unmatched;
      this.lastUpdated = new Date();
    }
  },
  computed: {
    lastUpdatedFormatted() {
      const lastUpdated = this.lastUpdated.toString();
      return lastUpdated.toString().substr(0, lastUpdated.length - 34);
    }
  }
};
</script>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.left {
  flex: 1;
}
.admin-notifs {
  background: white;
  width: 100%;
  height: 100%;
}
.service-request-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.service-request-summary > h1 {
  margin-bottom: 15px;
}
.service-request-stats {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px 16px 36px 16px;
}
.stat-cards {
  padding-left: 16px;
}
.timestamp {
  position: absolute;
  bottom: 10px;
  right: 10px;
  flex: 1;
  opacity: 0.5;
  margin-top: auto;
}
</style>
