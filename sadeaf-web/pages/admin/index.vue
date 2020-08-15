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
import SuperTable from "../../components/tables/SuperTable";
import StatCard from "../../components/StatCard";
import ActionsTray from "../../components/ActionsTray";
import DoughnutChart from "../../components/charts/Doughnut";
import NotetakersCell from "../../components/tables/custom-columns/NotetakersCell";

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
      search: null,
      tableFields: [
        { name: 'client', label: 'Client', type: 'string', width: 120 },
        // { name: 'age', label: 'Age', type: 'int' },
        // { name: 'salary', label: 'Salary', type: 'float', precision: 2, step: 0.1},
        { name: 'status', label: 'Status', type: 'enum', enum: ['Pending', 'Live', 'Dead'], width: 120 },
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
      tableData: [{
        client: 'Tom',
        status: 'Pending',
        date: '2016-05-03',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
      }, {
        client: 'John',
        status: 'Live',
        date: '2016-05-02',
        event: 'IS112: Intro to Programming II',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Eli',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5603AQHl_BixhF9QOw/profile-displayphoto-shrink_100_100/0?e=1602720000&v=beta&t=lPviBneWF8uM4A4BN9tGpoBvFReXu0lewa5BAX2UEcc'
        }, {
          name: 'Weiyuan',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5603AQGQHsAl3P_VDA/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=ygRrmujDhgpwHjOIW01I_xkftZOZ5kpG9JCgtnFvZQs'
        }],
      }, {
        client: 'Morgan',
        status: 'Live',
        date: '2016-05-04',
        event: 'IS113: Web Application Development',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Tedmund',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5103AQHlCmi1sznkng/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=cFtcVy3V14Q5TTivNBwqOP0sUMYJFiuXux40UTY5pN8'
        }, {
          name: 'Wayne',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5603AQEoomKi9Ky-1Q/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=UgQtklOFgE98jPkL_8_hEeMC9tOQ1sYipuE9V9JUVbM'
        }],
      }, {
        client: 'Jessy',
        status: 'Live',
        date: '2016-05-01',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Aus',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5103AQH9nm5CFMJ9GA/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=JNVjy67kfrng_l-tulCTjPRsMie4C8UkPTloQnXm6ck'
        }],
      }, {
        client: 'Tom',
        status: 'Pending',
        date: '2016-05-03',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
      }, {
        client: 'John',
        status: 'Live',
        date: '2016-05-02',
        event: 'IS112: Intro to Programming II',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Eli',
        }, {
          name: 'Weiyuan'
        }],
      }, {
        client: 'Morgan',
        status: 'Live',
        date: '2016-05-04',
        event: 'IS113: Web Application Development',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Tedmund',
        }, {
          name: 'Wayne'
        }],
      }, {
        client: 'Jessy',
        status: 'Live',
        date: '2016-05-01',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Aus',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5103AQH9nm5CFMJ9GA/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=JNVjy67kfrng_l-tulCTjPRsMie4C8UkPTloQnXm6ck'
        }],
      }, {
        client: 'Tom',
        status: 'Pending',
        date: '2016-05-03',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
      }, {
        client: 'John',
        status: 'Live',
        date: '2016-05-02',
        event: 'IS112: Intro to Programming II',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Eli',
        }, {
          name: 'Weiyuan'
        }],
      }, {
        client: 'Morgan',
        status: 'Live',
        date: '2016-05-04',
        event: 'IS113: Web Application Development',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Tedmund',
        }, {
          name: 'Wayne'
        }],
      }, {
        client: 'Jessy',
        status: 'Live',
        date: '2016-05-01',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Aus',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5103AQH9nm5CFMJ9GA/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=JNVjy67kfrng_l-tulCTjPRsMie4C8UkPTloQnXm6ck'
        }],
      }, {
        client: 'Tom',
        status: 'Pending',
        date: '2016-05-03',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
      }, {
        client: 'John',
        status: 'Live',
        date: '2016-05-02',
        event: 'IS112: Intro to Programming II',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Eli',
        }, {
          name: 'Weiyuan'
        }],
      }, {
        client: 'Morgan',
        status: 'Live',
        date: '2016-05-04',
        event: 'IS113: Web Application Development',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Tedmund',
        }, {
          name: 'Wayne'
        }],
      }, {
        client: 'Jessy',
        status: 'Live',
        date: '2016-05-01',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Aus',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5103AQH9nm5CFMJ9GA/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=JNVjy67kfrng_l-tulCTjPRsMie4C8UkPTloQnXm6ck'
        }],
      }, {
        client: 'Tom',
        status: 'Pending',
        date: '2016-05-03',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
      }, {
        client: 'John',
        status: 'Live',
        date: '2016-05-02',
        event: 'IS112: Intro to Programming II',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Eli',
        }, {
          name: 'Weiyuan'
        }],
      }, {
        client: 'Morgan',
        status: 'Live',
        date: '2016-05-04',
        event: 'IS113: Web Application Development',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Tedmund',
        }, {
          name: 'Wayne'
        }],
      }, {
        client: 'Jessy',
        status: 'Live',
        date: '2016-05-01',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Aus',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5103AQH9nm5CFMJ9GA/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=JNVjy67kfrng_l-tulCTjPRsMie4C8UkPTloQnXm6ck'
        }],
      }, {
        client: 'Tom',
        status: 'Pending',
        date: '2016-05-03',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
      }, {
        client: 'John',
        status: 'Live',
        date: '2016-05-02',
        event: 'IS112: Intro to Programming II',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Eli',
        }, {
          name: 'Weiyuan'
        }],
      }, {
        client: 'Morgan',
        status: 'Live',
        date: '2016-05-04',
        event: 'IS113: Web Application Development',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Tedmund',
        }, {
          name: 'Wayne'
        }],
      }, {
        client: 'Jessy',
        status: 'Live',
        date: '2016-05-01',
        event: 'IS111: Intro to Programming',
        location: '1 Stanford Road, Singapore 123456',
        notetakers: [{
          name: 'Aus',
          imgSrc: 'https://media-exp1.licdn.com/dms/image/C5103AQH9nm5CFMJ9GA/profile-displayphoto-shrink_200_200/0?e=1602720000&v=beta&t=JNVjy67kfrng_l-tulCTjPRsMie4C8UkPTloQnXm6ck'
        }],
      }],
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
