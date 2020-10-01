<template>
  <h1>Service Requestor Home Page</h1>
</template>

<script>
import StatusIndicator from "../../components/StatusIndicator";

export default {
  name: "service_requestor-home",
};
</script>

<style scoped>
.el-menu-nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
}

.el-menu-nav .nav-logo {
  display: flex;
  align-items: center;
  flex: 1;
  outline: none;
}
.nav-logo .indicator {
  padding-left: 15px;
}
</style>
