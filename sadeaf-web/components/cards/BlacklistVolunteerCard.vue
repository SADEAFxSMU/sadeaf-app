<template>
  <div class="volunteer-blacklist-card">
    <el-row v-for="volunteer in volunteers"
            :key="volunteer.id + 'blacklistCard'"
            class="margin-bottom__md">
      <el-card
        class="volunteer-blacklist-card"
      >
        <el-row
          justify="start"
          type="flex"
          :gutter="16"
        >
          <el-col :span="1.5">
            <el-avatar
              :size="70"
              shape="square"
              :src="volunteer.account.profile_pic_url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            />
          </el-col>

          <el-col :span="22">
            <el-row class="margin-bottom__sm">
              <h3>{{ volunteer.account.name }}</h3>
            </el-row>

            <el-row class="margin-bottom__sm">
              <div class="el-icon-phone" />
              <el-divider direction="vertical" />
              {{ volunteer.account.email }}
            </el-row>
            <el-row>
              <div class="el-icon-message" />
              <el-divider direction="vertical" />
              {{ volunteer.account.contact }}
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>

</template>

<script>
export default {
  name: 'BlacklistVolunteerCard',
  props: {
    volunteers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};

</script>

<style lang="scss">

</style>
<style scoped lang="scss">

.volunteer-blacklist-card {
  width: 500px;
}
.margin-bottom {
  &__sm {
    margin-bottom: 8px;

    &-not-last:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  &__md {
    margin-bottom: 16px;
  }
}
</style>
