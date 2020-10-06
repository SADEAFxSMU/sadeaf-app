<template>
  <fieldset class="danger-zone">
    <legend>{{ title }}</legend>
    <slot />
  </fieldset>
</template>

<script>
export default {
  name: 'DangerZone',

  props: {
    title: {
      type: String,
      required: false,
      default: 'Danger Zone',
    },
  },
};
</script>

<style scoped>
.danger-zone {
  background: #fff3f3;
  border-radius: 4px;
  border: 1px solid #ffafaf;
}
.danger-zone > legend {
  color: #cb4e4e;
  font-weight: bold;
  padding: 0 6px 0 6px;
  border-radius: 4px;
  line-height: 24px;
}
</style>
