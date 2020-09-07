<template>
  <div class="assignment-info">
    <user-card-horizontal-small v-if="hasVolunteerAssigned"
                                :user="assignment.volunteer.account"
                                style="margin-bottom: 4px;" />
    <p>
      {{ assignment.address_line_one }}, {{ assignment.postal }}
    </p>
  </div>
</template>

<script>
import UserCardHorizontalSmall from "../user/UserCardHorizontalSmall";
export default {
  name: "AssignmentCard",
  components: {UserCardHorizontalSmall},
  props: {
    assignment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasVolunteerAssigned() {
      return this.assignment.volunteer && this.assignment.volunteer.account;
    },
  }
};
</script>

<style scoped>

</style>
