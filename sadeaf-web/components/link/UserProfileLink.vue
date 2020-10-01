<template>
  <nuxt-link-wrapper :to="profileLink" :should-link="shouldLink">
    <slot />
  </nuxt-link-wrapper>
</template>

<script>
import NuxtLinkWrapper from './NuxtLinkWrapper';
import { getUserProfilePagePath } from '../../common/types/users';

export default {
  name: 'UserProfileLink',

  props: {
    user: {
      type: Object,
      required: true,
    },
    shouldLink: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  components: {
    NuxtLinkWrapper,
  },

  computed: {
    profileLink() {
      return getUserProfilePagePath({ role: this.role, id: this.id });
    },
    id() {
      return this.user.id;
    },
    role() {
      return this.user.role;
    },
  },
};
</script>

<style scoped></style>
