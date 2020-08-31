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
                   @click="handleInsertClick"/>
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
            <el-button size="mini"
                       icon="el-icon-edit"
                       round
                       @click="handleEditClick(scope.$index, scope.row)" />
            <el-popconfirm confirmButtonText='Confirm'
                          cancelButtonText='Cancel'
                          icon="el-icon-info"
                          iconColor="red"
                          title="Are you sure you want to delete this?"
                          @onConfirm="handleDeleteConfirm(scope.$index, scope.row)">
              <el-button slot="reference"
                         size="mini"
                         icon="el-icon-delete"
                         round />
            </el-popconfirm>
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
    <insert-dialog :schema="schema"
                   :role="role"
                   :visible="insertDialogVisible"
                   @confirm="handleInsertConfirm"
                   @close="insertDialogVisible = false" />
    <update-dialog :schema="schema" :role="role"
                   :values="{...editRow}"
                   :index="editIndex"
                   :visible="updateDialogVisible"
                   @confirm="handleUpdateConfirm"
                   @close="updateDialogVisible = false" />
  </div>
</template>

<script>
import CRUD_TREE from '../../common/types/crud_tree.json';
import { FullscreenMixin } from '../../common/mixins';
import {
  buildGraphQLQuery,
  buildGraphQLUpdate,
  buildGraphQLInsert,
  buildGraphQLDelete,
} from "../../common/types/GraphqlCrudManager";
import UpdateDialog from "./UpdateDialog";
import InsertDialog from "./InsertDialog";

const STRING = 'string';
const INT = 'int';
const FLOAT = 'float';
const NUMERIC = 'numeric'
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
  name: "CrudTable",
  components: {InsertDialog, UpdateDialog},
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
      editIndex: null,
      insertDialogVisible: false,
      updateDialogVisible: false,
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
    handleInsertClick() {
      const editRow = {};
      this.tableColumns.forEach(column => editRow[column.name] = null);
      this.insertDialogVisible = true;
    },
    handleEditClick(index, row) {
      this.editRow = row;
      this.createMode = false;
      this.editIndex = index;
      this.updateDialogVisible = true;
    },
    handleDeleteConfirm(index, row) {
      const deleteMutation = buildGraphQLDelete({
        schema: this.schema,
        role: this.role,
        pk: row.id
      });
      this.$apollo.mutate({ mutation: deleteMutation });
      this.$emit('delete', index, row);
    },
    handleInsertConfirm(values) {

      this.$emit('insert', values);
    },
    handleUpdateConfirm(changes, index, row) {
      const schema = this.schema;
      const role = this.role;

      const query = buildGraphQLUpdate({ schema, role, pk: row.id, newValues: changes });

      this.$apollo.mutate({
        mutation: query
      });
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
