<template>
  <div class="page">
    <el-row class="primary-content">
      <el-col :xs="24" :lg="12">
        <h1 class="title">
          Welcome Back, Wei Yong! <el-spinner/>
        </h1>
        <div class="progress-chart">
          <doughnut-chart title="PROGRESS"
                          :data="{
                            labels: ['Confirmed', 'Pending'],
                            datasets: [
                              {
                                label: 'Completed',
                                backgroundColor: ['lightseagreen', 'rgba(255,89,133,0.7)'],
                                borderWidth: 1,
                                borderColor: ['rgb(84,202,255)', 'rgb(255,89,133)'],
                                data: [4, 2]
                              }
                            ]
                          }"
                          :options="{
                            animation: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: false
                          }"/>
          <div class="stat-cards">
            <stat-card title="Confirmed" stat="4" accent-color="lightseagreen" />
            <stat-card title="Pending" stat="2" accent-color="rgba(255,89,133,0.7)" />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :lg="12">
        <actions-tray :actions="actions"/>
      </el-col>
    </el-row>
    <div class="service-requests">
      <super-table title="Service Requests"
                   :table-data="tableData"
                   :table-columns="tableFields"/>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import SuperTable from "../../components/tables/SuperTable";
import StatCard from "../../components/StatCard";
import ActionsTray from "../../components/ActionsTray";
import DoughnutChart from "../../components/charts/Doughnut";
import NotetakersCell from "../../components/tables/custom-columns/NotetakersCell";
import StatusCell from "../../components/tables/custom-columns/StatusCell";

export default {
  name: "index",
  components: {
    DoughnutChart,
    ActionsTray,
    StatCard,
    SuperTable,
  },

  data() {
    return {
      assignment: null,
      search: null,
      tableFields: [
        { name: 'client', label: 'Client', type: 'string', width: 120 },
        // { name: 'age', label: 'Age', type: 'int' },
        // { name: 'salary', label: 'Salary', type: 'float', precision: 2, step: 0.1},
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
      actions: [{
        category: 'Administrative',
        subcategory: 'Onboard',
        desc: 'Complete onboarding for Charles Xavier',
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dragon Lee',
        isUrgent: true,
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dog Lee',
        isUrgent: true,
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cat Lee',
        isUrgent: true,
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cow Lee',
        isUrgent: true,
      }, {
        category: 'Client',
        subcategory: 'Client Cancellation',
        desc: 'Acknowledge client cancellation'
      }, {
        category: 'Administrative',
        subcategory: 'Onboard',
        desc: 'Complete onboarding for Charles Xavier',
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dragon Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dog Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cat Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cow Lee'
      }, {
        category: 'Client',
        subcategory: 'Client Cancellation',
        desc: 'Acknowledge client cancellation'
      }, {
        category: 'Administrative',
        subcategory: 'Onboard',
        desc: 'Complete onboarding for Charles Xavier',
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dragon Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dog Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cat Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cow Lee'
      }, {
        category: 'Client',
        subcategory: 'Client Cancellation',
        desc: 'Acknowledge client cancellation'
      }, {
        category: 'Administrative',
        subcategory: 'Onboard',
        desc: 'Complete onboarding for Charles Xavier',
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dragon Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Dog Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cat Lee'
      }, {
        category: 'Client',
        subcategory: 'Failed Service Request',
        desc: 'Send apology email to Cow Lee'
      }, {
        category: 'Client',
        subcategory: 'Client Cancellation',
        desc: 'Acknowledge client cancellation'
      }, {
        category: 'Internal',
        subcategory: 'Interview',
        desc: 'Conduct interview for Sunny Lim'
      }],
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
     * Mapping graphql event query result to tableData
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
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .page {
  }

  .title {
    font-size: 3em;
    color: #3d5264;
  }

  .primary-content {
    display: flex;
    flex-wrap: wrap;
    min-height: 60vh;
  }

  .progress-chart {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .stat-cards {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .service-requests {
    padding-top: 20px;
  }
</style>
