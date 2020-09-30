<template>
  <div>
    <h1>Pending</h1>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { accountFieldsFragment } from "../../../common/graphql/fragments";
/**
 * Page for sadeaf admins to handle pending users
 */
export default {
  name: "pending",

  data() {
    return {
      pendingUsers: [],
    }
  },

  apollo: {
    pendingUsers: {
      query: gql`
        query AllPendingUsers {
          pendingUsers: account(
            where: {role:{_eq: "pending"}}
          ) {
            id
            ...accountFields
          }
        }
        ${accountFieldsFragment}
      `
    }
  }
};
</script>

<style scoped>

</style>
