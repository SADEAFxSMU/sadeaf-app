<template>
  <div class="form-container">
    <div class="profile">
      <div class="avatar">
        <el-avatar
          class="el-icon-user-solid profile-pic"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 150px;
            width: 150px;
            font-size: 70px;
          "
        />
      </div>
      <div class="form-wrapper">
        <h3 class="border-bottom">{{ email }}</h3>
        <el-form :model="form" :rules="rules" class="form" ref="form">
          <el-form-item label="Full Name" prop="fullname" required>
            <el-input v-model="form.fullname" placeholder="John Smith" />
          </el-form-item>
          <el-form-item label="Contact" prop="contact" required>
            <el-input v-model="form.contact" placeholder="XXXXXXXX" />
          </el-form-item>
          <slot name="role-form" />
          <el-form-item>
            <el-button-group style="width: 100%; display: flex; justify-content: center">
              <el-button
                icon="el-icon-refresh"
                style="width: 10%; display: flex; justify-content: center"
                @click="handleFormReset"
              ></el-button>
              <el-button @click="handleConfirm" style="width: 70%" type="primary">Confirm</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseSignUpForm',
  data() {
    return {
      form: {
        fullname: null,
        contact: null,
        profile_pic_url: null,
      },
      rules: {
        fullname: [{ required: true, message: 'Please enter your full name', trigger: 'blur' }],
      },
    };
  },
  methods: {
    validateForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log('valid!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleFormReset() {
      this.form = {};
      this.$emit('reset', this.form);
    },
    handleConfirm() {
      this.validateForm();
      this.$emit('confirm', this.form);
    },
    handleCancel() {
      console.log('cancelled');
    },
    handleFormChange(fields) {
      console.log(fields);
    },
  },
  computed: {
    email() {
      return this.$store.state.auth.user.email;
    },
  },
};
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 1000px;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  min-width: 300px;
}

.form {
  background-color: #ffffff;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 1px 1px 6px 1px #e4e6ef;
  width: 100%;
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 16px;
}

.profile-pic {
  border-radius: 50%;
  margin-bottom: 16px;
  width: 250px;
  box-shadow: 2px 2px 8px 1px #cccce7;
}

.border-bottom {
  margin-bottom: 12px;
}

.avatar {
  position: relative;
}
</style>
