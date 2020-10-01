<template>
  <base-profile :user="user" :loading="$apollo.loading">
    <template v-slot:role-content>
      <div>
        <h1>Service Requestor Stuff</h1>
      </div>
    </template>
  </base-profile>
</template>

<script>
import BaseProfile from "./BaseProfile";
import gql from 'graphql-tag';
import { accountFieldsFragment } from "../../../common/graphql/fragments";

const ServiceRequestorQuery = gql`
query ServiceRequestorQueryByAccountId($id: Int!) {
  user: account_by_pk(id: $id){
    ...accountFields
    service_requestor {
      id
    }
  }
}
${accountFieldsFragment}
`;

export default {
  name: "ServiceRequestorProfile",

  components: {
    BaseProfile
  },

  props: {
    userId: {
      type: [String, Number],
      required: true,
    }
  },

  data() {
    return {
      user: null,
    }
  },

  computed: {
    events() {
      return this.user.events;
    }
  },

  apollo: {
    user: {
      query: ServiceRequestorQuery,
      variables() {
        return {
          id: this.userId,
        }
      }
    }
  },
};
</script>

<style scoped>

</style>
