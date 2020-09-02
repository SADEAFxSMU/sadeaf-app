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
      <el-button type="primary" @click="updateAccountDetails('formInput')">Update Profile Details</el-button>
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
        returning {
          name
          username
          email
        }
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
      // TODO: If we are using Cognito, we should send these new details to Cognito as well
      updateAccountDetails(formName) {
        this.$refs[formName].validate((validInputs) => {
          if (validInputs) {
            this.$apollo.mutate({
              mutation: UPDATE_PROFILE_QUERY,
              variables: {
                name: this.accountDetails.name,
                email: this.accountDetails.email,
                password: this.accountDetails.password,
                username: this.username,
              }
            }).then(d => alert("Updated!"))
              .catch(e => alert("Failed to update!" + e.message()))
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
