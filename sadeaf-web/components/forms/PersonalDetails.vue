<template>
  <div>
    <el-card shadow="hover" class="card">
      <div slot="header" class="clearfix">
        <span class="card-header">{{ cardHeader.toLocaleUpperCase()  }}</span>
        <el-button class="edit-btn" type="text" @click="toggleEdit">Edit</el-button>
      </div>

      <!-- Display form if edit-->
      <div v-if="edit">
        <el-form
          label-width="auto"
          label-position="top"
          ref="formInput"
          :model="formValuesToValidate"
          :rules="rules"
          size="small"
        >

          <el-form-item
            v-for="(formField, fieldKey) in personalDetails"
            :key="fieldKey"
            :prop="fieldKey"
            :label="formField.label"
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

          <el-form-item size="large">
            <el-button ref="formButton" type="primary" @click="updateAccountDetails('formInput')">
              Update
            </el-button>
            <el-button @click="resetForm('formInput')">Reset</el-button>
          </el-form-item>

        </el-form>
      </div>

      <div v-else>
        <el-row
          v-for="(personalInfo, fieldKey) in personalDetails"
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
export default {
  name: "PersonalDetails",
  props: {
    'cardHeader': String,
    'updateCallback': {
        type: Function
      },
    'personalDetails': {
        type: Object,
      },
    },
  data() {
    return {
      edit: false,
      rules: {
        name: [
          {required: true, message: "Please input a name", trigger: "change"},
        ],
        contact: [
          {required: true, message: "Please input a contact number", trigger: "change"},
          {type: 'number', message: "Please input a valid contact number", trigger: "change", min:10000000, max:99999999},
        ],
        email: [
          {required: true, message: "Please input an email", trigger: "change"},
          {type: 'email', message: 'Please input valid email address', trigger: 'change'}
        ],
      },
    }
  },
  computed: {
    // to validate form values using the default rules array, Element requires form values to be in the format
    // {[key]: value}
    formValuesToValidate: function() {
      const formVals = {}
      Object.keys(this.personalDetails).forEach(key => {
        formVals[key] = this.personalDetails[key].value
      });
      return formVals;
    }
  },
  methods: {
    toggleEdit() {
      this.edit = !this.edit;
      console.log(this.personalDetails)
    },
    resetForm(formName) {
      // TODO: Implement later
      this.$refs[formName].resetFields();
    },
    updateAccountDetails(formName) {
      this.$refs[formName].validate((validInputs) => {
        if (validInputs) {
          this.updateCallback(this.personalDetails);
        } else {
          return false;
        }
      })
    },
  }
}
</script>

<style scoped>

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
  }

  .personal-details-card-padding:last-child {
    padding-bottom: 0;
  }

  .form-item {
    margin-bottom: px;
  }

  .card-header {
    font-size: 13px;
    letter-spacing: .4px;
    font-weight: bold;
  }

  .card {
    width: 550px;
  }
</style>
