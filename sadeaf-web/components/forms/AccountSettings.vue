<template>
  <!--   TODO: Validate Form fields-->
  <el-form label-width="100px" ref="formInput" label-position="left" :model="accountDetails" :rules="rules">

    <el-form-item label="Full Name" prop="name">
      <el-input prop="fullName" v-model="accountDetails.name"/>
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input prop="email" v-model="accountDetails.email"/>
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input prop="password" type="password" v-model="accountDetails.password"/>
    </el-form-item>

    <el-form-item size="large">
      <el-button ref="formButton" type="primary" @click="updateAccountDetails('formInput')">Update Profile Details
      </el-button>
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

  export default {
    name: "AccountSettings",
    data() {
      return {
        // TODO: Update username to to be current logged in user --> Taken from vue store?
        username: "pep2e",
        account: [{name: "", email: "", password: ""}],
        // Rules for form
        rules: {
          name: [
            {required: true, message: "Please input a name", trigger: "blur"},
          ],
          email: [
            {required: true, message: "Please input an email", trigger: "blur"},
            {type: 'email', message: 'Please input valid email address', trigger: ['blur', 'change']}
          ],
        }
      }
    },
    computed: {
      accountDetails: function () {
        return this.account[0]
      }
    },
    methods: {
      // TODO: Handle password change
      updateAccountDetails(formName) {
        this.$refs[formName].validate((validInputs) => {
          if (validInputs) {
            // TODO: Store these endpoints in a constants folder?
            this.$axios.$post("http://localhost:4000/api/v1/accounts/updateDetails",
              {
                ...this.accountDetails,
                username: this.username,
              },
              {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": 'application/json'
                }
              })
              .then(d => alert("Updated!"))
              .catch(e => alert("Failed to update!"))
          } else {
            return false;
          }
        })
      }
    },
    apollo: {
      account: {
        query: GET_PROFILE_DETAILS,
        variables() {
          return {username: this.username}
        },
        update: data => data.account,
      },
    },
  }
</script>

<style scoped>

</style>
