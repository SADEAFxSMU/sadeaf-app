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
      <action-card
        v-for="(action, i) in actions"
        :key="'action' + i"
        :action="action"
        @check="handleActionCardChecked"
        class="action-card"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ActionCard from './ActionCard';
import PendingUserList from './user/PendingUserList';

export default {
  name: 'ActionsTabs',

  components: { PendingUserList, ActionCard },

  data() {
    return {
      actions: [
        {
          title: 'Example notification 1',
          message: 'This is an example of an urgent notification',
          isUrgent: true,
        },
        {
          title: 'Example notification 2',
          message: 'This is an example of a notification',
          isUrgent: false,
        },
      ],
    };
  },

  methods: {
    handleActionCardChecked(action) {
      alert('Checked ' + action.title);
    },
  },
};
</script>

<style scoped>
.pending-users {
  padding: 0 32px 0 32px;
}
.action-card {
  margin-bottom: 16px;
}
</style>
