<template>
  <div ref="basetable"
       class="base-table">
    <div class="title-wrapper">
      <h1 class="heading">{{title}}</h1>
      <el-button icon="el-icon-full-screen"
                 @click="toggleFullscreen('basetable')"
                 circle />
    </div>
    <el-table :data="paginatedTableData"
              size="small"
              :cell-style="{padding: '5px'}"
              style="width: 100%;">
      <el-table-column v-for="(column, i) in tableColumns"
                       sortable
                       :key="'column-' + i"
                       :label="column.label"
                       :prop="column.name"
                       :filters="getFilters(column)"
                       :filter-method="filterHandler"
                       :width="column.width">
        <!-- Slot here needs to be set to some rubbish else vue will apply the template to all columns -->
        <template :slot="column.custom ? 'default' : ''"
                  slot-scope="{ $index, row }"
                  v-if="column.custom">
          <div :is="column.custom"
               :row="row"
               :editable="false" />
        </template>
      </el-table-column>
      <el-table-column align="right" :min-width="150">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini"
                       icon="el-icon-edit"
                       round
                       @click="handleEdit(scope.$index, scope.row)" />
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       round
                       @click="handleDelete(scope.$index, scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background
                     :page-size="this.rowLimit"
                     :total="this.tableDataFiltered.length"
                     :pager-count="10"
                     :current-page="this.currentPage"
                     @current-change="this.handlePageChange" />
    </div>
    <crud-dialog :row="{...editRow}"
                 :index="editIndex"
                 :visible="crudDialogVisible"
                 :fields="tableColumns"
                 @confirm="this.handleEditConfirm"
                 @close="crudDialogVisible = false"/>
  </div>
</template>

<script>
import { FullscreenMixin } from '../../common/mixins';
import CrudDialog from "./CrudDialog";

const STRING = 'string';
const INT = 'int';
const FLOAT = 'float';
const ENUM = 'enum';
const DATETIME = 'datetime';
const supportedTypes = new Set([STRING, INT, FLOAT, ENUM, DATETIME]);
const defaultFormatters = {
  [STRING]: x => x,
  [INT]: x => x,
  [FLOAT]: x => x,
  [ENUM]: x => x,
  [DATETIME]: x => x,
};

export default {
  name: "BaseTable",
  components: {CrudDialog},
  props: {
    title: {
      type: String,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    tableColumns: {
      type: Array,
      required: true,
    }
  },
  mixins: [FullscreenMixin],
  data() {
    return {
      search: "",
      selects: {},
      rowLimit: 10, // Limit rows for pagination
      currentPage: 1, // Local state for current selected page
      editRow: null,
      editIndex: null,
      visible: false,
      crudDialogVisible: false,
      crudDialogHasEdits: false,
    };
  },
  created() {
    this.STRING = STRING;
    this.INT = INT;
    this.FLOAT = FLOAT;
    this.ENUM = ENUM;
    this.DATETIME = DATETIME;

    /**
     * Perform prop validation:
     *   1. Check if props data types passed in are supported
     *   2. No colliding column names
     * Dynamically create keys in this component's data object (state)
     * for each of the columns passed in - to support search functionality
     */
    // for (const column of this.tableColumns) {
    //   this.searches[this.getSearchKey(column.name)] = null;
    // }
  },
  methods: {
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleEdit(index, row) {
      this.editRow = row;
      this.editIndex = index;
      this.crudDialogVisible = true;
    },
    handleDelete(index, row) {
      // TODO: Show delete confirmation prompt

    },
    handleEditConfirm(changes, index, row) {
      // Post to hasura?
      console.log(changes);
    },
    getFilters(column) {
      if (column.type === INT || column.type === FLOAT) {
        return null;
      }
      if (column.type === ENUM) {
        return column.enum.map(val => ({text: val, value: val}));
      }

      const uniqueVals = new Set();
      for (const row of this.tableData) {
        const value = row[column.name];
        uniqueVals.add(value);
      }
      return [...uniqueVals].map(x => ({ text: x, value: x }));
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
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
      return this.tableData.filter(data => {
        if (!this.search) return true;
        const searchString = this.search.toLowerCase();
        for (const column in data) {
          const value = data[column];
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
        return false;
      });
    },
  }
};
</script>

<style scoped>
.base-table {
  overflow: scroll;
  background: #ffffff;
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
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
