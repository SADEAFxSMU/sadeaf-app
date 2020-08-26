<template>
  <div>
    <button @click="userLogin()">Submit</button>
<!--    <el-form label-width="100px" ref="loginForm" :model="login">-->
<!--      <el-form-item label="Email">-->
<!--        <el-input v-model="login.username"></el-input>-->
<!--      </el-form-item>-->

<!--      <el-form-item label="Password" prop="pass">-->
<!--        <el-input type="password" v-model="login.password"></el-input>-->
<!--      </el-form-item>-->

<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="userLogin()">Submit</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
  </div>
</template>
<script>
  export default {
    name: "Login",
    data() {
      return {
        labelPosition: 'right',
        login: {
          username: '',
          password: '',
        }
      };
    },
    methods: {
      async userLogin() {
        try {
          let response = await this.$auth.loginWith('dev');
          console.log("HERE", response);
        } catch (err) {
          console.log("ERROR", err);
        }
      }
    }
  }
</script>
