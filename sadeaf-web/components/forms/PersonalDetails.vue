<template>
  <div>
    <slot name="test"></slot>
    <el-card shadow="hover" class="account-details-card">
      <div slot="header" class="clearfix">
        <span>{{ cardHeader.toLocaleUpperCase() }}</span>
        <el-button class="edit-btn" type="text" @click="toggleEdit">Edit</el-button>
      </div>

      <!-- Display form if edit-->
      <div class="personal-details-form" v-if="edit">
        <el-form
          label-width="auto"
          label-position="top"
          ref="formInput"
          :model="formValuesToValidate"
          :rules="rules"
          size="small"
          status-icon
        >

          <el-form-item
            v-for="(formField, fieldKey) in personalDetails"
            :key="fieldKey"
            :prop="fieldKey"
            :label="formField.label.toLocaleUpperCase()"
            class="form-item"
          >

            <el-input-number
              :controls=false
              size="small"
              type="number"
              v-if="fieldKey == 'contact'"
              v-model.number="formField.value"
            />

            <el-input
              v-else
              v-model="formField.value"
            />

          </el-form-item>

          <el-form-item size="small">
            <el-button ref="formButton"
                       type="primary"
                       @click="updateAccountDetails('formInput')"
            >
              Update
            </el-button>
            <el-button @click="resetForm()">Reset</el-button>
          </el-form-item>

        </el-form>
      </div>

      <div v-else>
        <el-row
          v-for="(personalInfo, fieldKey) in cachedDetails"
          :key="fieldKey"
          class="personal-details-card-padding"
        >
          <el-col>

            <el-row>
              <div class="personal-details-card-label">{{ personalInfo.label.toLocaleUpperCase() }}</div>
            </el-row>

            <el-row>
              <div class="personal-details-card-text">{{ personalInfo.value }}</div>
            </el-row>

          </el-col>
        </el-row>

      </div>

    </el-card>
  </div>
</template>

<script>
import gql from 'graphql-tag';

const GET_PROFILE_DETAILS = gql`
          query MyQuery($username: String!) {
              account(where: {username: {_eq: $username}}) {
              name
              email
              contact
            }
          }`;

export default {
  name: 'PersonalDetails',
  props: {
    'cardHeader': String,
  },
  data() {
    return {
      edit: false,
      editPassword: true,
      username: 'austinwoon',
      personalDetails: {},
      // Cached details represent original account details of user
      cachedDetails: {},
      rules: {
        name: [
          { required: true, message: 'Please input a name', trigger: 'change' },
        ],
        contact: [
          { required: true, message: 'Please input a contact number', trigger: 'change' },
          {
            type: 'number',
            message: 'Please input a valid contact number',
            trigger: 'change',
            min: 10000000,
            max: 99999999,
          },
        ],
        email: [
          { required: true, message: 'Please input an email', trigger: 'change' },
          { type: 'email', message: 'Please input valid email address', trigger: 'change' },
        ],
      },
    };
  },
  mounted() {
    this.getProfileDetails().then((d) => {
      this.cachedDetails = this.getCardDetails(d);
      this.personalDetails = this.getCardDetails(d);
    });
  },
  computed: {
    formValuesToValidate: function() {
      /**
       *  Computed var to validate form values using the default rules array,
       *  Element requires form values to be in the format
       *  {[key]: value}
       */
      const formVals = {};
      Object.keys(this.personalDetails).forEach(key => {
        formVals[key] = this.personalDetails[key].value;
      });
      return formVals;
    },
  },
  methods: {
    getCardDetails(accDetails) {
      const cardDetails = {};
      Object.keys(accDetails).forEach((k) => {
        cardDetails[k] = {
          value: accDetails[k],
          label: k[0].toUpperCase() + k.slice(1),
        };
      });

      return cardDetails;
    },
    async getProfileDetails() {
      const variables = { 'username': this.username };
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await this.$apollo.query({
            query: GET_PROFILE_DETAILS,
            variables,
            fetchPolicy: 'no-cache',
          });

          const [accDetails] = data.account;
          delete accDetails['__typename'];
          resolve(accDetails);
        } catch (e) {
          reject('Failed to fetch');
        }
      });
    },
    toggleEdit() {
      this.edit = !this.edit;

      if (!this.edit && this.personalDetails.updated) {
        this.getProfileDetails().then((d) => {
          this.personalDetails = this.getCardDetails(d);
          this.cachedDetails = this.getCardDetails(d);
        });
      }
    },
    resetForm() {
      this.personalDetails = JSON.parse(JSON.stringify(this.cachedDetails));
    },
    updateAccount(accDetails) {
      const data = { username: this.username };
      Object.keys(accDetails).forEach(k => {
        data[k] = accDetails[k].value;
      });

      this.$axios.$post('/api/v1/accounts/updateDetails',
        data,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then(d => this.$message({ message: 'Updated profile details!', type: 'success' }))
        .catch(e => {
          throw new Error('Failed to update');
        });
    },
    updateAccountDetails(formName) {
      this.$refs[formName].validate((validInputs) => {
        if (validInputs) {
          try {
            this.updateAccount(this.personalDetails);
            this.personalDetails.updated = true;
          } catch (e) {
            this.$message.error('Failed to update profile details! Please try again');
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
//these styles are shared w password details, can clean up w global stylesheet
.account-details-card {
  .el-card__header {
    font-size: 13px;
    letter-spacing: .4px;
    font-weight: bold;
  }

  .el-form-item__label {
    font-size: 11px;
    color: #909399;
    padding-bottom: 0px;
  }

  .el-form-item {
    margin-bottom: 12px;
  }

  .el-form-item:last-child {
    margin-bottom: 0px;
  }

  .el-input__inner {
    font-size: 13px;
    color: #303133;
    text-align: left;
  }
}
</style>
<style scoped lang="scss">

.edit-btn {
  float: right;
  padding: 3px 0;
}

.personal-details-card-label {
  font-size: 11px !important;
  color: #909399;
  padding-bottom: 5px;
}

.personal-details-card-text {
  font-size: 13px;
  font-weight: 450;
  color: #303133;
}

.personal-details-card-padding {
  padding-bottom: 15px;

  &:last-child {
    padding-bottom: 0;
  }
}



.personal-details-card {
  // TODO: Add transition on card resize from personal details to form
  width: 550px;
}
</style>
