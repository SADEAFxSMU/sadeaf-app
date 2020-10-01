<template>
  <nuxt-link :to="to" v-if="shouldLink" style="text-decoration: none; color: inherit;">
    <slot />
  </nuxt-link>
  <div v-else>
    <slot />
  </div>
</template>

<script>
export default {
  name: "NuxtLinkWrapper",

  props: {
    to: {
      type: String,
      required: true,
    },
    shouldLink: {
      type: Boolean,
      required: false,
      default: true,
    }
  },
};
</script>

<style scoped>

</style>
