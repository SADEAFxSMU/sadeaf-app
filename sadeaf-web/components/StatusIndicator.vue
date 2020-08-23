<template>
  <div class="status" :style="{ color, fontWeight: 'bold' }">
    <div class="circle" :style="{ backgroundColor: color }" />
    {{ text }}
  </div>
</template>

<script>
  export default {
    name: "StatusIndicator",
    props: {
      text: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      }
    }
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
