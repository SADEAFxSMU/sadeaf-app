<template>
  <el-tabs class="action-tabs" type="border-card" stretch>
    <el-tab-pane label="Matching" style="height: 100%; width: 100%; overflow: scroll">
      <pending-assignments-matching-list />
    </el-tab-pane>
    <el-tab-pane label="New Users" style="height: 100%; width: 100%; overflow: scroll">
      <pending-user-list class="pending-users" />
    </el-tab-pane>
    <el-tab-pane label="Notifications">
      <div class="notifications">
        <action-card
          v-for="(action, i) in actions"
          :key="'action' + i"
          :action="action"
          @check="handleActionCardChecked"
          class="action-card"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ActionCard from './ActionCard';
import PendingUserList from './user/PendingUserList';
import PendingAssignmentsMatchingList from './PendingAssignmentsMatchingList';

export default {
  name: 'ActionsTabs',

  components: { PendingAssignmentsMatchingList, PendingUserList, ActionCard },

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

<!-- Not scoped because gotta override el-tabs__content and el-tabs__header -->
<style>
.action-tabs {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.action-tabs .el-tabs__header .is-active {
  border-bottom: 2px solid #98cbff;
  transition: border-bottom 0s;
}
.action-tabs .el-tabs__content {
  height: 100%;
  width: 100%;
  overflow: scroll;
  padding: 0;
}
.action-tabs .pending-users {
  height: 100%;
  padding: 0 32px 0 32px;
}
.action-tabs .action-card {
  margin-bottom: 16px;
}
.notifications {
  padding: 16px;
}
</style>
