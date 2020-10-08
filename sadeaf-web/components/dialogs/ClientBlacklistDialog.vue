<template>
  <el-dialog
    destroy-on-close
    v-if="volunteer && assignments.length > 0"
    :visible="visible"
    @close="closeViewMore"
    width="75%"
  >
    <el-row class="margin-bottom__sm" justify="start" align="middle" type="flex" :gutter="16">
      <el-col :span="1.5">
        <el-avatar
          :size="69"
          shape="square"
          :src="
            this.volunteer.account.profile_pic_url ||
            'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          "
        />
      </el-col>

      <el-col :span="22">
        <el-row class="margin-bottom__sm">
          <h1>{{ volunteer.account.name }}</h1>
        </el-row>
      </el-col>
    </el-row>

    <BaseTable title="Completed Assignments History" :show-operations="false" :rows="assignments" :columns="columns" />
  </el-dialog>
</template>

<script>
import BaseTable from '@/components/tables/BaseTable';

export default {
  name: 'ClientBlacklistDialog',
  components: { BaseTable },
  data() {
    return {
      columns: [
        {
          name: 'name',
          label: 'Event Name',
        },
        {
          name: 'start_dt',
          label: 'Date',
        },
        {
          name: 'description',
          label: 'Description',
        },
        {
          name: 'status',
          label: 'Status',
        },
      ],
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    assignments() {
      return this.$store.state.clientBlacklist.assignments.map((a) => ({
        ...a,
        start_dt: new Date(a.start_dt).toDateString(),
        name: a.event.name,
        description: a.event.description,
      }));
    },
    volunteer() {
      return this.$store.state.clientBlacklist.volunteer;
    },
  },
  methods: {
    closeViewMore() {
      this.$store.commit('clientBlacklist/hideDialog');
    },
  },
};
</script>

<style scoped></style>
