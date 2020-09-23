<template>
  <status-indicator :color="color"
                    :text="statusText"
                    v-bind="$attrs" />
</template>

<script>
import {
  ASSIGNMENT_STATUSES,
  ASSIGNMENT_STATUS_COLORS
} from "../common/types/constants";
import StatusIndicator from "./StatusIndicator";

export default {
  name: "AssignmentStatus",

  components: {
    StatusIndicator
  },

  props: {
    status: {
      type: String,
      required: true,
      validator: val => ASSIGNMENT_STATUSES.hasOwnProperty(val)
    }
  },

  computed: {
    color() {
      return ASSIGNMENT_STATUS_COLORS[this.status];
    },
    statusText() {
      return this.status.split("_").join(" ");
    }
  }
};
</script>

<style scoped>

</style>
