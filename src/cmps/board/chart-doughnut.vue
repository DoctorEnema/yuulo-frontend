
<script>
// import VueCharts from 'vue-chartjs'
import { Doughnut } from "vue-chartjs";
export default {
  extends: Doughnut,
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ["Red", "Blue", "Yellow"],
      datasets: [
        {
          label: "My First Dataset",
          data: [300, 50, 100],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    });
  },
};
</script>
