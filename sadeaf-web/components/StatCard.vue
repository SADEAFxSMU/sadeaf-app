<template>
  <div class="statcard">
    <el-icon class="icon" :type="icon"></el-icon>
    <div :class="bodyClass">
      <h1 class="stat">{{ stat }}</h1>
      <h1 class="title">{{ title }}</h1>
    </div>
    <div class="statcard-accent" :style="`backgroundColor: ${accentColor}; ${accentPosition || 'left'}: 0`" />
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
    titlePosition: {
      type: String,
      required: false,
      validator: (val) => ['right', 'bottom'].includes(val),
      default: 'right',
    },
    stat: {
      type: [String, Number],
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    accentPosition: {
      type: String,
      required: false,
      default: 'left',
      validator: (val) => ['top', 'right', 'bottom', 'left'].includes(val)
    }
  },

  computed: {
    bodyClass() {
      return this.titlePosition === 'right' ? 'main-content-row' : 'main-content-col';
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
  background: white;
  box-shadow: 0 2px 4px 1px #d0ddf0;
  overflow: hidden;
  padding: 8px 24px 0 16px;
  min-width: 250px;
  min-height: 120px;
  max-height: 200px;
  margin: 8px;
  color: #486177;
}

.icon {
  font-size: 3.5em;
  color: #486177;
  margin-right: 16px;
}

.main-content-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  text-align: right;
}
.main-content-col {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.title {
  font-size: 1.5em;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: normal;
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
