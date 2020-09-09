<template>
  <!--  should probably be using slots here to render children but im b**lsdeep -->
  <el-card shadow="hover" class="account-details-card">
    <div slot="header" class="clearfix">
      <span>{{ cardHeader.toLocaleUpperCase() }}</span>
    </div>

    <el-form
      ref="passwordForm"
      :model="passwordForm"
      v-if="this.editPassword"
      :rules="rules">
      <el-form-item label="CURRENT PASSWORD" prop="currentPassword">
        <el-input type="password"
                  size="small"
                  v-model="passwordForm.currentPassword"
                  show-password
        />
      </el-form-item>

      <el-form-item label="NEW PASSWORD" prop="newPassword">
        <el-input type="password"
                  size="small"
                  v-model="passwordForm.newPassword"
                  show-password
        />
      </el-form-item>

      <el-form-item label="CONFIRM PASSWORD" prop="confirmNewPassword">
        <el-input type="password"
                  size="small"
                  v-model="passwordForm.confirmNewPassword"
                  show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="changePassword" size="small" type="primary">Change Password</el-button>
        <el-button size="small" @click="toggleEditPassword">Cancel</el-button>
      </el-form-item>
    </el-form>

    <div v-else>
      <el-button size="small"
                 type="primary"
                 plain
                 @click="toggleEditPassword"
      >
        Change Password
      </el-button>
    </div>


  </el-card>

</template>

<script>

import gql from 'graphql-tag';

const GET_PASSWORD = gql`
          query MyQuery($username: String!) {
              account(where: {username: {_eq: $username}}) {
              password
            }
          }`;

export default {
  name: 'PasswordDetails',
  props: {
    cardHeader: String,
  },
  data() {
    return {
      editPassword: false,
      // TODO: update username to be retrieved from store
      username: 'austinwoon',
      passwordForm: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
      rules: {
        currentPassword: [
          { required: true, message: 'Required Field!', trigger: 'blur' },
          { validator: this.validateCurrentPassword, trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: 'Required Field!', trigger: 'blur' },
          { validator: this.validateNewPassword, trigger: 'blur' },
        ],
        confirmNewPassword: [
          { required: true, message: 'Required Field!', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' },
        ],

      },
    };
  },
  methods: {
    toggleEditPassword() {
      this.editPassword = !this.editPassword;
    },
    checkPassword(pw) {
      /**
       * Checks if password meets the following criteria
       * The password length must be greater than or equal to 8
       * The password must contain one or more uppercase characters
       * The password must contain one or more lowercase characters
       * The password must contain one or more numeric values
       * The password must contain one or more special characters
       */
      const reg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return reg.test(pw);
    },
    validateNewPassword(rule, value, callback) {
      if (!this.checkPassword(this.passwordForm.newPassword)) {
        callback(new Error('Please ensure your password meets the criteria!'));
      } else if (this.passwordForm.newPassword !== '') {
        this.$refs.passwordForm.validateField('confirmNewPassword');
      }
      callback();
    },
    validateConfirmPassword(rule, value, callback) {
      const { newPassword, confirmNewPassword } = this.passwordForm;
      if (newPassword === '') {
        return callback();
      } else if (!this.checkPassword(newPassword)) {
        callback(new Error('Please ensure your password meets the criteria!'));
      } else if (confirmNewPassword !== newPassword) {
        callback(new Error('Please ensure your two passwords match!'));
      }
      callback();
    },
    async validateCurrentPassword(rule, value, callback) {
      /**
       * Calls current db  to see if password in DB matches current password input
       * @type {{username: string}}
       */
      const variables = {
        'username': this.username,
      };
      try {
        const { data } = await this.$apollo.query({
          query: GET_PASSWORD,
          variables,
          // TODO: Cache current pw to reduce network call when verifying current pw
          fetchPolicy: 'no-cache',
        });

        // TODO: Handle encrypted password, right now password is just stored as string in DB
        const currentPw = data.account[0].password;
        if (this.passwordForm.currentPassword === currentPw) {
          callback();
        } else {
          callback(new Error('Inputted password does not match your current password!'));
        }
      } catch (e) {
        callback(new Error('Servers down, please contact administrator'));
      }
    },
    changePassword() {
      // TODO: Hash passwords in the future
      const data = {
        newPassword: this.passwordForm.newPassword,
        currentPassword: this.passwordForm.currentPassword,
        username: this.username,
      };
      this.$refs.passwordForm.validate((validInputs) => {
        if (validInputs) {
          try {
            this.$axios.post('/api/v1/accounts/updatePassword', data, {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            })
              .then(d => {
                this.$message({ message: 'Updated password!', type: 'success' });
                this.toggleEditPassword();
              })
              .catch(e => {
                throw new Error('Failed to change password');
              });
          } catch (e) {
            this.$message.error('Failed to update password! Please try again');
          }
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
