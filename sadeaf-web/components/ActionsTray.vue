<template>
  <div class="action-tray">
    <div style="width: 100%">
      <h1 class="heading">Action Tray</h1>
      <div class="actions">
        <div v-for="action in currentPageItems"
             style="padding: 8px; width: 100%;">
          <action-card :action="action"/>
        </div>
      </div>
    </div>
    <el-pagination
      @current-change="handleActionsPageChange"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="this.actions.length">
    </el-pagination>
  </div>
</template>

<script>
import ActionCard from "./ActionCard";
import { chunk } from "lodash";

export default {
  name: "ActionsTray",
  components: {ActionCard},
  props: {
    actions: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      pages: [],
      pageSize: 8,
      currentPage: 0,
    }
  },
  mounted() {
    // Put actions into chunks
    this.pages = chunk(this.actions, this.pageSize);
  },
  computed: {
    currentPageItems() {
      return this.pages[this.currentPage];
    },
  },
  methods: {
    handleActionsPageChange(val) {
      this.currentPage = val - 1;
    }
  }
};
</script>

<style scoped>
.action-tray {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: rgba(226, 230, 255, 0.53);
  border-radius: 5px;
  padding: 16px;
  height: 100%;
  min-height: 100%;
  box-shadow: inset 2px 2px 8px rgba(0,0,0,0.1);
}
.actions {
  padding-top: 16px;
  width: 100%;
}
.heading {
  color: #6989a7;
}
</style>
