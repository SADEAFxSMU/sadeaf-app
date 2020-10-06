<template>
  <div
    class="blacklist-assignment-card"
    v-if="assignments"
  >
    <el-row>
      <span
        class="assignment-card-button-badge"
      >
        Latest Assignment Details
      </span>
    </el-row>

    <el-card
      class="assignment-card"
      shadow="never"
    >

      <el-row>
        <span class="assignment-card-date">
          {{ new Date(assignments[0].start_dt).toDateString() }}
        </span>
      </el-row>

      <el-row>
        <h4>{{ assignments[0].event.name }}</h4>
      </el-row>

      <el-row
        type="flex"
        justify="end"
      >
        <el-button
          type="text"
          class="view-more-btn"
          @click="toggleViewMoreEvents"
        >
          View More
        </el-button>
      </el-row>

    </el-card>
  </div>

</template>

<script>
export default {
  name: 'BlacklistCardAssignments',
  props: {
    assignments: {
      type: Array,
      required: true,
    },
    volunteer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    toggleViewMoreEvents() {
      this.$store.commit('clientBlacklist/clickDialog', {
        volunteer: this.volunteer,
        assignments: this.assignments,
      });
    },
  },
};
</script>

<style lang="scss">
</style>
<style scoped lang="scss">
.assignment-card {
  background-color: #ECF8FF;

  &-button-badge {
    position: absolute;
    top: -10px;
    left: 5px;
    font-size: 12px;
    font-weight: bold;
    background-color: #E4E7ED;
    border-radius: 30px;
    padding: 3px 15px 3px 15px;
  }

  &-date {
    font-size: 12px;
  }
}

.view-more-btn {
  padding: 0 0 0 0;
}
</style>
