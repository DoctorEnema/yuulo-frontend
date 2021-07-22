<template>
  <section class="dashboard" @click="closeDashboard">
    <button class="close-dashboard"></button>
    <h1>Dashboard</h1>
    <div class="charts-container">
    <chart-bar class="bar-chart"/>
    <chart-doughnut class="doughnut-chart"/>
    </div>
  </section>
</template>

<script>
// import VueCharts from 'vue-chartjs'
// import { Bar, Line } from 'vue-chartjs'
import chartBar from './chart-bar.vue'
import chartDoughnut from './chart-doughnut.vue'
export default {
  data() {
    return {};
  },
  components: {
    chartBar,
    chartDoughnut
  },
  computed: {
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
  },
  methods: {
    closeDashboard() {
      this.$router.push(`/board/${this.selectedBoard._id}`);
    },
  },
};
</script>

<style>
</style>