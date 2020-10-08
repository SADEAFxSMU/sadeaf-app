<template>
  <div class="no-data">
    <img src="~/static/nodata.png" alt="No data placeholder image" />
    <h1 class="text">{{ text }}</h1>
  </div>
</template>

<script>
export default {
  name: 'NoDataPlaceholder',

  props: {
    text: {
      type: String,
      required: false,
      default: 'No Data',
    },
  },
};
</script>

<style scoped>
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.no-data > img {
  opacity: 0.3;
  width: 50px; /* width of container */
  height: 70px; /* height of container */
  object-fit: cover;
  object-position: 50% 10%; /* try 20% 10% */
}
.no-data .text {
  color: #c5c5d0;
  margin-left: 16px;
}
</style>
