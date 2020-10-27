<template>
  <base-sign-up-form @confirm="handleConfirm" @reset="form = {}">
    <el-form :model="form" :rules="rules" ref="form" slot="role-form" class="form">
      <el-form-item label="Organisation" prop="organisation">
        <el-input v-model="form.organisation" />
      </el-form-item>
      <el-form-item label="Designation">
        <el-input v-model="form.designation" />
      </el-form-item>
      <el-form-item label="Preferred Comm. Mode" prop="preferred_comm_mode" required>
        <el-select v-model="form.preferred_comm_mode">
          <el-option
            v-for="preferredCommMode in PREFERRED_COMM_MODES"
            :value="preferredCommMode"
            :key="'opt-' + preferredCommMode"
          >
            {{ preferredCommMode }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Additional Notes">
        <el-input type="textarea" v-model="form.additional_notes" />
      </el-form-item>
    </el-form>
  </base-sign-up-form>
</template>

<script>
import _ from 'lodash';
import gql from 'graphql-tag';
import BaseSignUpForm from './BaseSignUpForm';
import VolunteerSearch from '../../user/VolunteerSearch';

import { PREFERRED_COMM_MODES } from '../../../common/types/constants';

export default {
  name: 'ClientSignUpForm',

  components: { VolunteerSearch, BaseSignUpForm },

  props: {},

  data() {
    return {
      form: {},
      rules: {
        preferred_comm_mode: [{ required: true, message: 'Please indicate your preferred mode of communication' }],
      },
      PREFERRED_COMM_MODES,
    };
  },

  methods: {
    validateForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log('Submit form ');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleConfirm(formValues) {
      this.validateForm();
      const form = { ...this.form, ...formValues };
    },
  },

  computed: {
    accountId() {
      return this.$store.state.auth.user.id;
    },
  },
};
</script>

<style scoped></style>
