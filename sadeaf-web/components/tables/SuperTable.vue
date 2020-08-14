<template>
  <div ref="supertable"
       class="super-table">
    <div class="title-wrapper">
      <h1 class="heading">Service Requests</h1>
      <el-button icon="el-icon-full-screen"
                 @click="toggleFullscreen('supertable')"
                 circle />
    </div>
    <el-table
      :data="tableDataFiltered"
      style="width: 100%;">
      <el-table-column v-for="column in tableSingleValueColumns"
                       :label="column.label"
                       :prop="column.name"
                       sortable
                       :filters="getFilters(column)"
                       :filter-method="filterHandler">
      </el-table-column>
      <el-table-column v-for="column in tableSelectColumns"
                       :label="column.label"
                       :prop="column.name">
        <template slot-scope="scope">
          <el-select @change="x => handleSelectChange(x, column, scope.$index, scope.row)"
                     :value="selects[column.name] && selects[column.name][scope.$index]">
            <el-option v-for="value in scope.row[column.name]"
                       :multiple="column.multiple"
                       :label="column.render(value)"
                       :value="column.render(value)">
              {{ column.render(value) }}
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Type to search"/>
        </template>
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="danger"-->
<!--            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { FullscreenMixin } from '../../common/mixins';

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
  name: "SuperTable",
  props: ['title', 'tableData', 'tableColumns'],
  mixins: [FullscreenMixin],
  data() {
    return {
      search: "",
      selects: {},
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
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSelectChange(x, column, index, row) {
      console.log(x);
      this.selects = {
        ...this.selects,
        [column.name]: {
          ...this.selects[column.name],
          [index]: [...row[column.name].map(column.render)]
        }
      }
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
    tableSingleValueColumns() {
      return this.tableColumns.filter(x => x.type !== 'select');
    },
    tableSelectColumns() {
      return this.tableColumns.filter(x => x.type === 'select');
    },
    tableDataFiltered() {
      // TODO: Use a worker for this expensive filtering
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
    }
  }
};
</script>

<style scoped>
.super-table {
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
</style>
