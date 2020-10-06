<template>
  <div>
    <div class="cell">
      <div v-for="volunteer in volunteers" class="volunteer">
        <user-card-horizontal-small :user="volunteer.account" />
      </div>
    </div>
  </div>
</template>

<script>
import UserCardHorizontalSmall from '../../user/UserCardHorizontalSmall';
export default {
  name: 'VolunteersCell',
  components: { UserCardHorizontalSmall },
  props: {
    volunteers: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.cell {
  padding: 0;
}

.cell > :last-child {
  margin-right: 0;
}

.volunteer {
  display: flex;
  align-items: center;
  padding: 6px;
}
</style>
