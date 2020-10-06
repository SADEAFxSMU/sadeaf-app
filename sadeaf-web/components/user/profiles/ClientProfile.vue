<template>
  <base-profile :user="user" :loading="$apollo.loading">
    <template v-slot:role-content>
      <div class="client-stats">
        <stat-card v-for="({value}, statName) in stats"
                   style="flex: 1;"
                   :title="statName"
                   title-position="bottom"
                   :stat="value"
                   accent-color="#a892fc" />
      </div>
      <div class="client-info">
        <h1>
          Client Information
        </h1>
        <table>
          <tr>
            <th>Organisation</th>
            <td>- {{ client.organisation }}</td>
          </tr>
          <tr>
            <th>Designation</th>
            <td>- {{ client.designation }}</td>
          </tr>
          <tr>
            <th>Comm Pref.</th>
            <td>- {{ client.preferred_comm_mode }}</td>
          </tr>
          <tr v-if="client.additional_notes">
            <th>*Note</th>
            <td>- {{ client.additional_notes }}</td>
          </tr>
        </table>
      </div>
    </template>
    <template v-slot:role-body>
      <h1 class="title">Events</h1>
      <div class="client-events">
        <div v-if="events && events.length > 0">
          <div v-for="event in events">
            <el-card style="margin: 8px;">
              <div class="event-card-header">
                <h3 style="margin-bottom: 4px;">
                  {{ event.name }}
                </h3>
                <status-indicator :text="event.uncompleted_status ? 'IN PROGRESS' : 'COMPLETED'"
                                  :color="event.uncompleted_status ? 'salmon': '#46cd6f'" />
              </div>
              <p style="color: #959aa5">{{ event.description }}</p>
            </el-card>
          </div>
        </div>
        <div v-else class="no-events">
          <h3>🙈 No events yet</h3>
        </div>
      </div>

    </template>
  </base-profile>
</template>

<script>
import BaseProfile from "./BaseProfile";
import gql from 'graphql-tag';
import StatCard from "../../StatCard";
import StatusIndicator from "../../StatusIndicator";
import DangerZone from "../../forms/DangerZone";

const ClientQuery = gql`
  query ClientQueryByAccountId($id: Int!) {
    client: client_by_pk(id: $id) {
      id
      designation
      additional_notes
      organisation
      preferred_comm_mode
      user: account {
        id
        name
        email
        role
        profile_pic_url
        contact
        created_at
      }
      events {
        id
        description
        name
        uncompleted_status
        purpose
        created_at
        updated_at
      }
      service_requestor {
        id
        organisation
      }
    }
  }
`;


export default {
  name: "ClientProfile",

  components: {
    DangerZone,
    StatusIndicator,
    StatCard,
    BaseProfile
  },

  props: {
    clientId: {
      type: [String, Number],
      required: true,
    }
  },

  data() {
    return {
      client: null,
    }
  },

  computed: {
    user() {
      return this.client && this.client.user;
    },
    events() {
      return this.client && this.client.events;
    },
    stats() {
      const events = this.events;
      let inProgress = 0;
      let completed = 0;
      events.forEach(event => {
        if (event.uncompleted_status === true) {
          inProgress++;
        } else {
          completed++;
        }
      });
      return {
        "in progress": {
          value: inProgress
        },
        "completed": {
          value: completed
        },
      }
    }
  },

  apollo: {
    client: {
      query: ClientQuery,
      variables() {
        return {
          id: this.clientId,
        }
      }
    }
  },
};
</script>

<style scoped>
.title {
  margin: 16px 0 12px 0;
}
.client-stats {
  display: flex;
  flex-wrap: wrap;
}
.client-info {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 24px;
  margin: 12px 8px 8px 8px;
  box-shadow: inset 2px 2px 8px #d9d9e9;
}
.client-info table {
  margin-top: 12px;
  color: #5f5f75;
}
.client-info table th {
  text-align: right;
}
.client-events {
  background: white;
  border-radius: 6px;
  box-shadow: 2px 2px 6px 1px #d8d8ee;
  padding: 8px;
  width: 100%;
  flex: 1;
}
.no-events {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.event-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
