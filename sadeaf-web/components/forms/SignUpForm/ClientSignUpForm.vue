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
import gql from 'graphql-tag';
import BaseSignUpForm from './BaseSignUpForm';

import { PREFERRED_COMM_MODES, ROLES } from '../../../common/types/constants';

const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient(
    $account_id: Int!
    $role: String
    $name: String
    $contact: String
    $profile_pic_url: String
    $organisation: String
    $designation: String
    $preferred_comm_mode: String
    $additional_notes: String
  ) {
    insert_client_one(
      object: {
        account_id: $account_id
        organisation: $organisation
        designation: $designation
        preferred_comm_mode: $preferred_comm_mode
        additional_notes: $additional_notes
      }
    ) {
      id
    }

    update_account_by_pk(
      pk_columns: { id: $account_id }
      _set: { role: $role, name: $name, contact: $contact, profile_pic_url: $profile_pic_url }
    ) {
      id
    }
  }
`;

export default {
  name: 'ClientSignUpForm',

  components: { BaseSignUpForm },

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
    submitForm(accountFields) {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            await this.createClient(accountFields);
            this.redirectToPending();
          } catch (err) {
            console.error(err);
            this.$message.error('Failed to create profile!');
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleConfirm(accountFields) {
      this.submitForm(accountFields);
    },
    async createClient(accountFields) {
      const { fullname, contact, profile_pic_url } = accountFields;
      await this.$apollo.mutate({
        mutation: CREATE_CLIENT_MUTATION,
        variables: {
          account_id: this.accountId,
          role: ROLES.client,
          name: fullname,
          contact,
          profile_pic_url,
          organisation: this.form.organisation,
          designation: this.form.designation,
          preferred_comm_mode: this.form.preferred_comm_mode,
          additional_notes: this.form.additional_notes,
        },
      });
      this.$message.success("Created profile successfully! Please hold for our admin's approval.");
    },
    redirectToPending() {
      this.$router.replace('/pending');
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
