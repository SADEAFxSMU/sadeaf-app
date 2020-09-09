<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span class="card-header">{{ cardHeader.toLocaleUpperCase() }}</span>
      <el-button class="edit-btn" type="text" @click="toggleEdit">Edit</el-button>
    </div>

    <el-form :model="passwordForm" v-if="this.editPassword">
      <el-form-item label="Current Password">
        <el-input type="password"
                  v-model="passwordForm.currentPassword"
                  show-password
        />

      </el-form-item>

      <el-form-item label="New Password">
        <el-input type="password"
                  v-model="passwordForm.newPassword"
                  show-password
        />
      </el-form-item>
    </el-form>

    <el-button v-else
               size="small"
               type="primary"
               plain
               @click="() => { this.editPassword = !this.editPassword }"
    >
      Change Password
    </el-button>
  </el-card>

</template>

<script>
export default {
  name: "PasswordDetails",
  props: {
    cardHeader: String,
  },
  data() {
    return {
      editPassword: true,
      passwordForm: { currentPassword: '', newPassword: '' },
    }
  }
}
</script>

<style scoped>

</style>
