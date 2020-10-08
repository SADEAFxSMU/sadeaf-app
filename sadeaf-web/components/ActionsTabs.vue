<template>
  <el-tabs type="border-card" stretch style="overflow: scroll">
    <el-tab-pane label="Matching">
      <div>
        <!-- TODO: integrate with BA's matching service -->
      </div>
    </el-tab-pane>
    <el-tab-pane label="New Users">
      <pending-user-list class="pending-users" />
    </el-tab-pane>
    <el-tab-pane label="Notifications">
      <div>

      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ActionCard from './ActionCard';
import PendingUserList from './user/PendingUserList';

export default {
  name: 'ActionsTabs',

  components: { PendingUserList, ActionCard },
};
</script>

<style scoped>
.pending-users {
  padding: 0 32px 0 32px;
}
</style>
