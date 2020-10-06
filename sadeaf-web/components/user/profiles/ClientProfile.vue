<template>
  <base-profile :user="user" :loading="$apollo.loading">
    <template v-slot:role-content>
      <div class="events-container">
        <h1>Events</h1>
        <div class="client-events">
          <div v-if="events && events.length > 0">
            <div v-for="event in events">
              <el-card style="margin: 8px;">
                <h3 style="margin-bottom: 4px;">{{ event.name }}</h3>
                <p style="color: #959aa5">{{ event.description }}</p>
              </el-card>
            </div>
          </div>
          <div v-else class="no-events">
            <h3>🙈 No events yet</h3>
          </div>
        </div>
      </div>
    </template>
  </base-profile>
</template>

<script>
import BaseProfile from "./BaseProfile";
import gql from 'graphql-tag';

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
.events-container {
  height: 100%;
  display: flex;
  flex-direction: column;
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
</style>
