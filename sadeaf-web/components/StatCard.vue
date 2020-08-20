<template>
  <div class="statcard">
    <el-icon class="icon" :type="icon"></el-icon>
    <div class="main-content">
      <h1 class="stat">{{ stat }}</h1>
      <h1 class="title">{{ title }}</h1>
    </div>
    <div class="statcard-accent"
         :style="`backgroundColor: ${accentColor}; ${accentPosition || 'left'}: 0`"/>
  </div>
</template>

<script>
export default {
  name: "StatCard",
  props: {
    accentColor: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    stat: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    accentPosition: {
      type: String,
      required: false,
      default: 'left',
      validator: (val) => ['top', 'right', 'bottom', 'left'].includes(val)
    }
  }
};
</script>

<style scoped>
  .statcard {
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 4px;
    box-shadow: 0 2px 4px 1px #d0ddf0;
    overflow: hidden;
    padding: 8px 24px 0 16px;
    min-width: 250px;
    min-height: 150px;
    max-height: 200px;
    margin: 8px;
    color: #486177;
  }

  .icon {
    font-size: 3.5em;
    color: #486177;
    margin-right: 16px;
  }

  .main-content {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: right;
  }

  .title {
    font-size: 1.5em;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin: 0;
  }

  .stat {
    font-size: 2.5em;
    margin: 0 12px 0 0;
  }

  .statcard-accent {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 100%;
  }
</style>
