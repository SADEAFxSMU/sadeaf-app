<template>
  <div class="page">
    <div class="create-profile">
      <h1 class="title">Create Profile</h1>
      <div class="form-container">
        <el-radio-group v-model="role">
          <el-radio-button label="client"> Client </el-radio-button>
          <el-radio-button label="volunteer"> Volunteer </el-radio-button>
          <el-radio-button label="service_requestor"> Service Requestor </el-radio-button>
        </el-radio-group>
        <client-sign-up-form v-if="role === 'client'" />
        <volunteer-sign-up-form v-else-if="role === 'volunteer'" />
      </div>
    </div>
  </div>
</template>

<script>
import ClientSignUpForm from '../components/forms/SignUpForm/ClientSignUpForm';
import VolunteerSignUpForm from "../components/forms/SignUpForm/VolunteerSignUpForm";

export default {
  name: 'registration-page',
  components: {VolunteerSignUpForm, ClientSignUpForm },
  data() {
    return {
      role: 'pending',
    };
  },
};
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  height: 100%;
}
.create-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
}
.create-profile .title {
  margin-bottom: 12px;
}
.create-profile .body {
  color: #5f5f75;
  line-height: 24px;
  text-justify: distribute;
}
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
