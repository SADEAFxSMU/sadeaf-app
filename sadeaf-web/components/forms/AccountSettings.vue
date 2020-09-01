<template>
  <!--   TODO: Validate Form fields-->
  <el-form label-width="100px" ref="formInput" label-position="left" :model="accountDetails">

    <el-form-item label="Full Name">
      <el-input prop="fullName" v-model="accountDetails.name"/>
    </el-form-item>

    <el-form-item label="Email">
      <el-input prop="email" v-model="accountDetails.email"/>
    </el-form-item>

    <el-form-item label="Password">
      <el-input prop="password" type="password" v-model="accountDetails.password"/>
    </el-form-item>

    <el-form-item size="large">
      <el-button type="primary" @click="updateAccountDetails">Submit Form</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import gql from 'graphql-tag'

  const GET_PROFILE_DETAILS = gql`
          query MyQuery($username: String!) {
              account(where: {username: {_eq: $username}}) {
              name
              email
              password
            }
          }
        `;

  const UPDATE_PROFILE_QUERY = gql`
    mutation MyMutation($username: String!, $name: String!, $email: String!, $password: String!) {
      update_account(where: {username: {_eq: $username}}, _set: {name: $name, email: $email}) {
        affected_rows
      }
    }
  `

  export default {
    name: "AccountSettings",
    data() {
      return {
        // TODO: Update username to to be current logged in user --> Taken from vue store?
        username: "pep2e",
        account: [{name: "", email: "", password: ""}],
      }
    },
    computed: {
      accountDetails: function () {
        return this.account[0]
      }
    },
    methods: {
      updateAccountDetails() {
        console.log("updating...");

        this.$apollo.mutate({
          mutation: UPDATE_PROFILE_QUERY,
          variables: {
            name: this.accountDetails.name,
            email: this.accountDetails.email,
            password: this.accountDetails.password,
            username: this.username,
          },

          // TODO: Check if you need to do this update step to update currently stored data on form --> Might not be needed, think later
          update: (cache, {data: {update_account}}) => {
            if (update_account.affected_rows) {
              if (this.type === "prviate") {
                const data = cache.readQuery({
                  query: GET_PROFILE_DETAILS
                })
                const newDetails = update_account.returning;
                data.account[0] = newDetails[0];
                cache.writeQuery({
                  query: GET_PROFILE_DETAILS,
                  data
                })
              }
            }
          }
        })
      }
    },
    apollo: {
      account: {
        query: GET_PROFILE_DETAILS,
        variables() {
          return { username: this.username }
        },
        update: data => data.account,
      },
    },
  }
</script>

<style scoped>

</style>
