<template>
  <div class="action-card" :class="{ 'danger-card': isUrgent }">
    <div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
    <div>
      <el-button icon="el-icon-check" circle @click="$emit('check', action)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionCard',
  props: {
    item: {
      type: [Number, String, Object],
      required: false,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  computed: {
    title() {
      return this.action.title;
    },
    message() {
      return this.action.message;
    },
    isUrgent() {
      return this.action.isUrgent;
    },
  },
};
</script>

<style scoped>
.action-card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 2px 2px 8px 1px rgba(0, 0, 50, 0.1);
  padding: 8px;
  width: 100%;
  min-height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h3 {
  font-size: 1.1em;
  margin-bottom: 8px;
  font-weight: normal;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.danger-card {
  background-color: #ee5959;
  color: #ffffff;
  animation: glow 1.5s infinite alternate;
}
.danger-card h3 {
  color: #ffffff;
  font-weight: bold;
}
@keyframes glow {
  0% {
    box-shadow: 0 0 8px 1px rgba(0, 0, 50, 0.1);
  }
  100% {
    box-shadow: 0 0 8px 1px #ff6363;
  }
}
</style>
