import { Doughnut } from "vue-chartjs";
export default {
  extends: Doughnut,
  name: "DoughnutChart",
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    }
  },
  methods: {
    render() {
      this.renderChart(this.data, {
        title: {
          display: true,
          text: this.title,
        },
        ...this.options
      });
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.render();
  },
  watch: {
    data() {
      this.render();
    }
  }
};
