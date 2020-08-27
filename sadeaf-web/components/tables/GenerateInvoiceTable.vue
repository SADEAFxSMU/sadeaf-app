<template>
  <div>

    <div class="generate-invoice-wrapper">
      <span class="invoice-table-header">Invoices</span>
      <el-button type="primary" @click="generateInvoices">Generate Invoices</el-button>
    </div>

    <el-table
      :data="pagedRows"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="id"
        label="Event Id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Event Name">
        <template slot="header" slot-scope="scope">
          <div class="event-name-wrapper">
            <div>Event Name</div>
            <div>
              <el-input
                v-model="search"
                size="small"
                placeholder="Search"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="Last Updated"
        width="250">
      </el-table-column>
      <el-table-column
        prop="client.account.name"
        label="Client Name"
        width="250">
      </el-table-column>
      <el-table-column
        width="50"
        type="selection">
      </el-table-column>

    </el-table>

    <!-- TODO(wy): change the page-sizes to something more realistic -->
    <div class="pagination-wrapper">
      <el-pagination
        @size-change="changePageSize"
        layout="prev, pager, next, sizes"
        :page-size="pageSize"
        :page-sizes="[1, 3, 5, 10]"
        :current-page.sync="currentPage"
        :total="totalRows"
      >

      </el-pagination>
    </div>

  </div>
</template>

<script>
    import gql from "graphql-tag";

    export default {
      name: "GenerateInvoiceTable",
      data() {
        return {
          search: "",
          selectedRows: [],
          event: [],
          currentPage: 1,
          pageSize: 3
        }
      },
      computed: {
        totalRows: function() {
          return this.filteredRows.length;
        },
        filteredRows: function() {
          return this.processedEventRows.filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()));
        },
        pagedRows: function() {
          let endIndex = (this.currentPage * this.pageSize)
          let startIndex = endIndex - this.pageSize;
          return this.processedEventRows.slice(startIndex, endIndex)
        },
        processedEventRows: function() {
          // formats and returns the formatted rows
          // we need to process/format the rows since the data from Hasura is raw
          const processedEventRows = [];

          if (this.event) {
            for (let row of this.event) {
              let updatedAtDate = new Date(Date.parse(row.updated_at))
              let processedRow = {...row}
              processedRow.updated_at = updatedAtDate.toLocaleString();
              processedEventRows.push(processedRow)
            }
          }

          return processedEventRows;
        }
      },
      methods: {
        generateInvoices() {
          console.log("Generating invoices for...");
          // TODO(wy): replace this with real logic
          for (let row of this.selectedRows) {
            console.log(`event id: ${row.id}`);
          }
        },
        handleSelectionChange(selectedRows) {
          this.selectedRows = selectedRows;
        },
        changePageSize(selectedPageSize) {
          this.pageSize = selectedPageSize;
          console.log(this.pageSize)
        }
      },
      apollo: {
        event: gql`
            query {
              event {
                id,
                name,
                updated_at,
                client {
                    account {
                        name
                    }
                }
              }
            }
        `
      }
    }
</script>

<style scoped>
  .generate-invoice-wrapper {
    padding: 0 0 10px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .invoice-table-header {
    font-size: 24px;
  }

  .event-name-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>
