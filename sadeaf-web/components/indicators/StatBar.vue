<template>
  <table>
    <tr v-for="{ label, percentage, color } in stats" class="stat-table-row">
      <td>
        <span class="stat-label">{{ label.toUpperCase() }}</span>
      </td>
      <td style="width: 100%">
        <el-progress :percentage="percentage" :color="color || barColor(percentage)" />
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'StatBars',

  props: {
    stats: {
      type: Array,
      required: true,
    },
  },

  methods: {
    barColor(percentage) {
      if (percentage < 50) return '#ff7b7b';
      return '#3dd670';
    },
  },
};
</script>

<style scoped>
.stat-table-row > td {
  padding: 2px 4px 2px 4px;
}
.stat-label {
  font-weight: bold;
  color: #5f5f75;
}
</style>
