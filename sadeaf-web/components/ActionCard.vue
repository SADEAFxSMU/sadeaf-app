<template>
  <div :class="`action-card ${isUrgent ? 'glowing-card' : ''}`">
    <div>
      <h3>{{ action.category }}</h3>
      <p>{{ action.desc }}</p>
    </div>
    <div>
      <el-button-group>
        <el-button icon="el-icon-check" circle/>
        <el-button icon="el-icon-close" circle/>
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActionCard",
  props: ['action'],
  computed: {
    isUrgent() {
      return this.action.isUrgent;
    },
  }
};
</script>

<style scoped>
.action-card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 2px 2px 8px 1px rgba(0,0,50,0.1);
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
  color: rgba(0,30,70,0.6);
  text-transform: uppercase;
}
.glowing-card {
  animation: glow 1.5s infinite alternate;
}
@keyframes glow {
  0% {
    box-shadow: 2px 2px 8px 1px rgba(0,0,50,0.1);
  }
  100% {
    box-shadow: 2px 2px 8px 1px #fa7272;
  }
}
</style>
