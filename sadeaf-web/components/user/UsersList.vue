<template>
  <div>
    <div class="users">
      <user-card v-for="user in users"
                 :user="user.account"
                 linkToPage
                 class="user-card" />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import UserCard from "./UserCard";
import { ROLES } from "../../common/types/constants";

const accountFieldsFragment = gql`
  fragment accountFields on account {
    id
    name
    username
    email
    role
    profile_pic_url
  }
`;

const allAdminsQuery = gql`
  query AllAdmins {
    admins: admin {
      id
      account { ...accountFields }
    }
  }
  ${accountFieldsFragment}
`;

const allVolunteersQuery = gql`
  query AllVolunteers {
    volunteers: volunteer {
      id
      account { ...accountFields }
    }
  }
  ${accountFieldsFragment}
`;

const allClientsQuery = gql`
  query AllClients {
    clients: client {
      id
      account { ...accountFields }
    }
  }
  ${accountFieldsFragment}
`;

const allServiceRequestorsQuery = gql`
  query AllServiceRequestors {
    service_requestors: service_requestor {
      id
      account { ...accountFields }
    }
  }
  ${accountFieldsFragment}
`

export default {
  name: "UsersList",
  components: {UserCard},
  props: {
    filterRoles: {
      type: Array,
      required: false,
      default: Object.keys(ROLES)
    }
  },

  data() {
    return {
      visible: false,
      selectedUser: null,
      admins: [],
      volunteers: [],
      clients: [],
      service_requestors: [],
    }
  },

  computed: {
    users() {
      let users = [];
      if (this.shouldShowAdmins) {
        users.push(...this.admins);
      }
      if (this.shouldShowVolunteers) {
        users.push(...this.volunteers);
      }
      if (this.shouldShowClients) {
        users.push(...this.clients);
      }
      if (this.shouldShowServiceRequestors) {
        users.push(...this.service_requestors);
      }
      return users;
    },

    shouldShowAdmins() {
      return this.filterRoles.includes(ROLES.admin);
    },

    shouldShowVolunteers() {
      return this.filterRoles.includes(ROLES.volunteer);
    },

    shouldShowClients() {
      return this.filterRoles.includes(ROLES.client);
    },

    shouldShowServiceRequestors() {
      return this.filterRoles.includes(ROLES.service_requestor);
    },
  },

  apollo: {
    admins: {
      query: allAdminsQuery,
      skip() {
        return !this.shouldShowAdmins;
      }
    },
    volunteers: {
      query: allVolunteersQuery,
      skip() {
        return !this.shouldShowVolunteers;
      }
    },
    clients: {
      query: allClientsQuery,
      skip() {
        return !this.shouldShowClients;
      }
    },
    service_requestors: {
      query: allServiceRequestorsQuery,
      skip() {
        return !this.shouldShowServiceRequestors;
      }
    }
  },
};
</script>

<style scoped>
.users {
  display: flex;
  flex-wrap: wrap;
  max-width: 800px;
}
.user-card {
  flex: 1;
  background: white;
  margin: 8px;
}
</style>
