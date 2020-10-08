<template>
  <nuxt-link-wrapper :to="link" :should-link="shouldLink">
    <slot />
  </nuxt-link-wrapper>
</template>

<script>
import NuxtLinkWrapper from './NuxtLinkWrapper';

export default {
  name: 'UserProfileLink',

  props: {
    link: {
      type: String,
      required: false,
    },
  },

  components: {
    NuxtLinkWrapper,
  },

  computed: {
    shouldLink() {
      // not undefined, not null, not empty string
      return Boolean(this.link);
    },
  },
};
</script>

<style scoped></style>
