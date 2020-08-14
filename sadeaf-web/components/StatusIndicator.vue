<template>
  <div class="status" :style="{ color, fontWeight: 'bold' }">
    <div class="circle" :style="{ backgroundColor: color }" />
    {{ text || 'STATUS' }}
  </div>
</template>

<script>
  export default {
    name: "StatusIndicator",
    props: ['text', 'color']
  };
</script>

<style scoped>
  .status {
    display: flex;
    align-items: center;
  }
  .circle {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50px;
    margin-right: 5px;
    background-color: lightgrey;
  }
</style>
