<template>
  <el-autocomplete
    v-model="existingAddress"
    :fetch-suggestions="querySearch"
    style="width: 100%;"
    placeholder="Address Search"
    @select="handleSelect"
    placement="top-start"
    clearable
    @clear="handleClear"
  >
    <i class="el-icon-search" slot="prepend" />
    <template v-slot="{ item }">
      <div>{{item['ADDRESS']}}</div>
    </template>
  </el-autocomplete>
</template>

<script>
import debounce from 'debounce';
export default {
  name: "AddressSearch",
  data(){
    return {
      results: [],
    }
  },

  props : {
    existingAddress : {
      type: String,
      required : false,
      default: ""
    }
  },

  created(){
    this.querySearch = debounce(this.querySearch, 300);
  },

  methods:{
    async querySearch(queryString, cb){
      if(queryString != '') {
        const response = await this.$axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${queryString}&returnGeom=Y&getAddrDetails=Y`)

        let displayData = []

        for (var items in response['data']['results']) {
          displayData.push({value: response['data']['results'][items]['ADDRESS']})
        }

        const results = {'addresses': response['data']['results']}
        cb(results.addresses.map((address) => ({...address, value: address['ADDRESS']})))
      }
    },

    async handleSelect(address){
      this.$emit('select', address)
    },

    async handleClear(){
      this.$emit('clear', null)
    },




  }


}
</script>

<style scoped></style>
