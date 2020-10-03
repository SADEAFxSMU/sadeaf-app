<template>
  <div>
    <el-card
      header="Volunteer Information"
    >
      <el-row
        class="margin-bottom__sm"
        type="flex"
        justify="space-around">
        <!--        TODO(Austin): Change src to Avatar url once user profile pic column has been pushed to master (Eli)-->
        <el-avatar
          :size="60"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        />
      </el-row>

      <el-row
        type="flex"
        justify="space-around"
      >
        <!--      TODO: insert name prop here-->
        <h3>{{ volunteerName }}</h3>
      </el-row>

      <el-row type="flex" justify="space-around">
        <el-col :span="4">
          <el-progress :percentage="80"></el-progress>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { RATING_KEYS } from '@/common/types/constants';

export default {
  name: 'AdminFeedbackVolunteerCard',
  data() {
    return {
      volunteerName: 'Austin Woon Quan',
    };
  },
  computed: {
    ratings() {
      let ratings = [];
      RATING_KEYS.forEach(k => {
        ratings.push({
          label: 'k',
          value: 5,
        });
      });
      return ratings;
    },
  },
};
</script>

<style scoped lang="scss">
span {
  display: block;
  height: 60px;
  width: 60px;
  line-height: 60px;
  border: 1px solid;

  -moz-border-radius: 30px; /* or 50% */
  border-radius: 30px; /* or 50% */
  color: black;
  text-align: center;
  font-size: 2em;
}

.margin-bottom__sm {
  margin-bottom: 8px;

  &-not-last:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
