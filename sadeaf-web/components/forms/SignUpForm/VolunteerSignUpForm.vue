<template>
  <base-sign-up-form @confirm="handleConfirm" @reset="form = {}">
    <el-form :model="form" :rules="rules" ref="form" slot="role-form" class="form">
      <el-form-item label="Skills">
        <el-checkbox-group v-model="form.skills">
          <el-checkbox label="Note-taker" />
          <el-checkbox label="Interpreter" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </base-sign-up-form>
</template>

<script>
import gql from 'graphql-tag';
import BaseSignUpForm from './BaseSignUpForm';

import { PREFERRED_COMM_MODES, ROLES } from '../../../common/types/constants';

const CREATE_VOLUNTEER_MUTATION = gql`
  mutation CreateVolunteer(
    $account_id: Int!
    $role: String
    $name: String
    $contact: String
    $profile_pic_url: String
    $notetaker: Boolean
    $interpreter: Boolean
  ) {
    insert_volunteer_one(object: { account_id: $account_id, notetaker: $notetaker, interpreter: $interpreter }) {
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
  name: 'VolunteerSignUpForm',

  components: { BaseSignUpForm },

  props: {},

  data() {
    return {
      form: {
        skills: [],
      },
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
            await this.createVolunteer(accountFields);
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
    async createVolunteer(accountFields) {
      const skills = this.form.skills;
      const { fullname, contact, profile_pic_url } = accountFields;
      const isNoteTaker = skills.includes('Note-taker');
      const isInterpreter = skills.includes('Interpreter');

      await this.$apollo.mutate({
        mutation: CREATE_VOLUNTEER_MUTATION,
        variables: {
          account_id: this.accountId,
          role: ROLES.volunteer,
          name: fullname,
          contact,
          profile_pic_url,
          notetaker: isNoteTaker,
          interpreter: isInterpreter,
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
