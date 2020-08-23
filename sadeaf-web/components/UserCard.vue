<template>
  <div class="card">
    <div :style="cardStyle" class="body-wrapper">
      <img :src="imgSrc || getRandomPic()"
           :style="imgStyle"
           class="image">
      <div class="text">
        <slot name="body"/>
      </div>
    </div>
    <div class="footer" v-if="$slots.footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    cardStyle: {
      type: [String, Object],
      required: false,
    },
    imgSrc: {
      type: String,
      required: true,
    },
    imgStyle: {
      type: [String, Object],
      required: false,
    }
  },
  data() {
    return {
      currentDate: new Date()
    }
  },
  methods: {
    getRandomPic() {
      return 'https://api.adorable.io/avatars/150/abott@adorable';
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 4px;
  box-shadow: 0 2px 6px 1px rgba(0,0,0,0.2);
  margin: 8px;
  flex: 1;
}
.body-wrapper {
  display: flex;
  align-items: center;
  padding: 16px;
}
.image {
  border-radius: 50%;
  box-shadow: 0 2px 6px 1px rgba(0,0,0,0.2);
}
.text {
  padding-left: 20px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  padding: 8px;
  background-color: rgba(0,0,50,0.05);
}
</style>
