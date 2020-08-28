<template>
  <div ref="basetable"
       class="base-table">
    <div class="title-wrapper" v-if="title || toolbar">
      <h1 class="heading" v-if="title">
        {{ title }}
      </h1>
      <div class="toolbar" v-if="toolbar">
        <el-button icon="el-icon-full-screen"
                   @click="toggleFullscreen('basetable')" />
        <el-button icon="el-icon-plus"
                   @click="handleCreate"/>
        <el-input v-model="search"
                  style="padding-left: 6px;"
                  placeholder="Type to search" />
      </div>
    </div>
    <el-table :data="paginatedTableData"
              size="small" border
              :cell-style="{padding: '5px'}"
              class="table"
              :class="{ 'elevated': elevated }">
      <el-table-column v-if="expandableRows" :type="'expand'">
        <template v-slot="{ row }">
          <slot name="expanded" :row="row">
          </slot>
        </template>
      </el-table-column>
      <el-table-column v-for="(column, i) in tableColumns"
                       resizable
                       sortable
                       :key="'column-' + i"
                       :label="column.label"
                       :prop="column.name"
                       :filters="getFilters(column)"
                       :filter-method="filterHandler"
                       :width="column.width">
        <template :slot="column.type === 'array' ? 'default' : ''"
                  slot-scope="{ $index, row }"
                  v-if="column.type === 'array'">
          <slot :name="column.name" :row="row" />
        </template>
        <template v-for="slot in Object.keys($scopedSlots)"
                  :slot="column.name === slot ? 'default' : ''"
                  slot-scope="{ row }"
                  v-if="column.name === slot">
          <slot :name="column.name" :row="row" />
        </template>
      </el-table-column>
      <el-table-column align="center" :min-width="150" label="Edit">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini"
                       icon="el-icon-edit"
                       round
                       @click="handleEdit(scope.$index, scope.row)" />
            <el-button size="mini"
                       icon="el-icon-delete"
                       round
                       @click="handleDelete(scope.$index, scope.row)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination hide-on-single-page
                     background
                     :page-size="rowLimit"
                     :total="tableDataFiltered.length"
                     :pager-count="10"
                     :current-page="currentPage"
                     @current-change="handlePageChange" />
    </div>
    <crud-dialog :row="{...editRow}"
                 :index="editIndex"
                 :create-mode="createMode"
                 :visible="crudDialogVisible"
                 :fields="tableColumns"
                 @confirm="handleEditConfirm"
                 @close="crudDialogVisible = false"/>
  </div>
</template>

<script>
import CRUD_TREE from '../../common/types/crud_tree.json';
import { FullscreenMixin } from '../../common/mixins';
import CrudDialog from "./CrudDialog";
import { buildGraphQLQuery } from "../../common/types/GraphqlCrudManager";

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
  [DATETIME]: x => new Date(x).toLocaleDateString(),
};

export default {
  name: "CrudTable",
  components: {CrudDialog},
  props: {
    title: {
      type: String,
      required: false,
    },
    schema: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    depth: {
      type: Number,
      required: false,
      default: 1
    },
    toolbar: {
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
    }
  },
  mixins: [FullscreenMixin],
  data() {
    return {
      search: "",
      currentPage: 1, // Local state for current selected page
      editRow: null,
      createMode: false,
      editIndex: null,
      visible: false,
      crudDialogVisible: false,
      crudDialogHasEdits: false,
      tableColumnsByName: {},
      tableData: [],
    };
  },

  mounted() {
    const schema = this.schema;
    const tableColumns = this.tableColumns;

    // Set default title based on schema name
    if (!this.title) {
      this.title = schema.charAt(0).toUpperCase() + schema.slice(1);
    }

    if (tableColumns.length > 0) {
      // Group columns by name
      tableColumns.forEach(column => {
        this.tableColumnsByName[column.name] = column;
        if (typeof column.editable === 'undefined') {
          this.tableColumnsByName[column.name].editable = true;
        }
      });

      this.fetchGraphql();
    }
  },

  methods: {
    fetchGraphql() {
      const schema = this.schema;
      const role = this.role;
      const depth = this.depth;
      const query = buildGraphQLQuery({ schema, role, depth });
      if (query) {
        this.$apollo
          .query({ query })
          .then(result => {
            this.tableData = result.data[schema];
          });
      }
    },
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleCreate() {
      this.editRow = {};
      this.createMode = true;
      this.tableColumns.forEach(column => this.editRow[column.name] = null);
      this.crudDialogVisible = true;
    },
    handleEdit(index, row) {
      this.editRow = row;
      this.createMode = false;
      this.editIndex = index;
      this.crudDialogVisible = true;
    },
    handleDelete(index, row) {
      // TODO: Show delete confirmation prompt

    },
    handleEditConfirm(changes, index, row) {
      this.$emit('update', changes, index, row);
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
    formatter(row, column, x) {
      const tableColumn = this.tableColumnsByName[column.property];
      const { type, formatter } = tableColumn;
      return formatter ? formatter(x) : defaultFormatters[type](x);
    }
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
    tableColumns() {
      if (!this.schema || !this.role) {
        return [];
      }
      const rolePermissions = CRUD_TREE[this.schema][this.role];
      if (rolePermissions) {
        const readFields = Object.values(rolePermissions.select);
        return readFields
          .filter(field => field.type !== 'object' && field.type !== 'array')
          .map(field => (
            { name: field.name, label: field.name, type: field.type }
          ));
      }
      return [];
    }
  },

  watch: {
    tableColumns() {
      this.fetchGraphql();
    }
  }
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
