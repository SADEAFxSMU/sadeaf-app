<template>
  <div class="cell">
    <div v-for="notetaker in notetakers"
         class="profile">
      <img :src="notetaker.imgSrc"
           class="image"
           style=""/>
      <h4 class="name">{{ notetaker.name }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotetakersCell",
  props: {
    row: {
      type: Object,
      required: true,
    }
  },
  computed: {
    notetakers() {
      return this.row.notetakers;
    },
  },
};
</script>

<style scoped>
.cell {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
}

.cell > :last-child {
  margin-right: 0;
}

.profile {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 10px;
}

.profile .image {
  margin: 2px;
  height: 30px;
  border-radius: 500px
}

.profile .name {
  font-weight: normal;
  padding-left: 4px;
}
</style>
