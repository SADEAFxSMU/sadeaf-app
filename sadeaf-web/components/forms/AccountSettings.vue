<template>
  <!--   TODO: Validate Form fields-->
  <div>
    <PersonalDetails
      card-header="Personal Details"
    />

    <div class="padding"/>
    <PasswordDetails
      card-header="Password Details"
    />

  </div>

</template>

<script>
import PersonalDetails from '@/components/forms/PersonalDetails';
import PasswordDetails from '@/components/forms/PasswordDetails';

export default {
  name: 'AccountSettings',
  components: { PasswordDetails, PersonalDetails },
  data() {
    return {
      accountDetails: {},
      passwordDetails: {},
    };
  },
  methods: {},
};
</script>

<style scoped>
.padding {
  margin: 10px;
}

</style>
