<template>
  <div ref="basetable"
       class="base-table">
    <div class="title-wrapper" v-if="title || showToolbar">
      <h1 class="heading" v-if="title">
        {{ title }}
      </h1>
      <div class="toolbar" v-if="showToolbar">
        <el-input v-model="search"
                  style="padding: 0 6px 0 6px;"
                  placeholder="Type to search" />
        <slot name="toolbar" />
      </div>
    </div>
    <el-table :data="paginatedTableData"
              size="small"
              :cell-style="{padding: '5px'}"
              class="table"
              highlight-current-row
              row-key="id"
              :expand-row-keys="expandedRowKeys"
              @expand-change="handleExpandRowsChange"
              border
              :class="{ 'elevated': elevated }">
      <el-table-column v-if="expandableRows" :type="'expand'">
        <template v-slot="{ row }">
          <slot name="expanded" :row="row" />
        </template>
      </el-table-column>
      <el-table-column v-for="(column, i) in columns"
                       resizable
                       :key="'column-' + i"
                       :label="column.label"
                       :prop="column.name"
                       :width="column.width">
        <template :slot="isSlotProvidedForColumn(column) ? 'default' : ''"
                  slot-scope="{ row }"
                  v-if="isSlotProvidedForColumn(column)">
          <slot :name="column.name" :row="row" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Operations"
        width="120">
        <template slot-scope="{ row }">
          <slot name="edit" :row="row" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination hide-on-single-page
                     background
                     :page-size="rowLimit"
                     :pager-count="11"
                     :total="tableDataFiltered.length"
                     :current-page="currentPage"
                     @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script>

const STRING = 'string';
const INT = 'int';
const FLOAT = 'float';
const NUMERIC = 'numeric';
const ENUM = 'enum';
const TIMESTAMP = 'timestamp';
const defaultFormatters = {
  [STRING]: x => x,
  [INT]: x => x,
  [FLOAT]: x => x,
  [NUMERIC]: x => x,
  [ENUM]: x => x,
  [TIMESTAMP]: x => new Date(x).toLocaleDateString(),
};

export default {
  name: 'BaseTable',
  props: {
    title: {
      type: String,
      required: false,
    },
    rows: {
      type: Array,
      required: false,
    },
    columns: {
      type: Array,
      required: false,
      default: () => [],
    },
    showToolbar: {
      type: Boolean,
      required: false,
      default: true,
    },
    elevated: {
      type: Boolean,
      required: false,
      default: true,
    },
    rowLimit: {
      type: Number,
      required: false,
      default: 10,
    },
    expandableRows: {
      type: Boolean,
      required: false,
      default: false,
    },
    columnWidth: {
      type: Number,
      required: false,
      default: 150,
    },
    expandedRowKeys: [],
  },
  data() {
    return {
      search: '',
      currentPage: 1, // Local state for current selected page
      editRow: null,
      editIndex: null,
      insertDialogVisible: false,
      updateDialogVisible: false,
      tableColumnsByName: {},
      columnOptions: {},
      tableData: [],
    };
  },

  methods: {
    handleExpandRowsChange(_, rows) {
      this.expandedRowKeys = rows.map(row => row.id);
    },
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    formatter(row, column, x) {
      const tableColumn = this.tableColumnsByName[column.property];
      const { type, formatter } = tableColumn;
      return formatter ? formatter(x) : defaultFormatters[type](x);
    },
    isSlotProvidedForColumn(column) {
      return column.name in this.$scopedSlots;
    },
  },

  computed: {
    paginatedTableData() {
      return this.tableDataFiltered.slice((this.currentPage - 1) * this.rowLimit, this.currentPage * this.rowLimit);
    },
    tableDataFiltered() {
      // TODO: Use a worker for this expensive filtering
      // reset currentPage to 1 when you search, this prevents table from showing "No Data" if your previously selected page was beyond
      // the new paginatedTableData length
      this.currentPage = 1;
      return this.rows.filter(data => {
        if (!this.search) return true;
        const searchString = this.search.toLowerCase();
        for (const column in data) {
          const value = data[column];
          if (value) {
            if (typeof value === 'string') {
              if (value.toLowerCase().includes(searchString)) {
                return true;
              }
            } else {
              if (value.toString().includes(searchString)) {
                return true;
              }
            }
          }
        }
        return false;
      });
    },
  },
};
</script>

<style scoped>
.base-table {
}

.table {
  border-radius: 8px;
}

.table.elevated {
  box-shadow: 0 2px 8px #d6d8dd;
}

.title-wrapper {
  display: flex;
  align-items: center;
  padding: 20px;
}

.title-wrapper .heading {
  margin-right: 12px;
  color: #6989a7;
}

.toolbar {
  display: flex;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
