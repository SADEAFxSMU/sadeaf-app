<template>
  <!--   TODO: Validate Form fields-->
  <div>
    <PersonalDetails
      card-header="Personal Details"
      :update-callback="this.updateAccountCb"
      :personal-details="this.accountDetails"
    />

    <PasswordDetails
    />

  </div>

</template>

<script>
  import gql from 'graphql-tag'
  import PersonalDetails from "@/components/forms/PersonalDetails";
  import PasswordDetails from "@/components/forms/PasswordDetails";

  const GET_PROFILE_DETAILS = gql`
          query MyQuery($username: String!) {
              account(where: {username: {_eq: $username}}) {
              name
              email
              contact
              password
            }
          }
        `;

  export default {
    name: "AccountSettings",
    components: {PasswordDetails, PersonalDetails},
    data() {
      return {
        // TODO: Update username to to be current logged in user --> Taken from vue store?
        username: "austin",
        accountDetails: {},
        passwordDetails: {},
      }
    },
    watch: {
      account(newVal) {
        const [ fetchedAccountDetails ] = newVal
        this.passwordDetails = { 'password': { value: fetchedAccountDetails['password'], label: 'password' } };
        delete fetchedAccountDetails["__typename"]
        delete fetchedAccountDetails['password']
        Object.keys(fetchedAccountDetails).forEach((k) => {
          this.accountDetails = {
            ...this.accountDetails,
            [k] : {
              value: fetchedAccountDetails[k],
              label: k[0].toUpperCase() + k.slice(1),
            }
          }
        })
      }
    },
    methods: {
      updatePasswordCb() {
        console.log("hello");
      },
      updateAccountCb(accDetails) {
        const data = {username: this.username};
        Object.keys(accDetails).forEach(k => {
          data[k]= accDetails[k].value
        })

        console.log(data);
        // TODO: Store these endpoints in a constants folder?
        this.$axios.$post("http://localhost:4000/api/v1/accounts/updateDetails",
          data,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": 'application/json'
            }
          })
          .then(d => this.$message({message: "Updated profile details!", type: "success"}))
          .catch(e => this.$message.error("Failed to update!"))
      },
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
