
<script>
// import VueCharts from 'vue-chartjs'
import { Doughnut } from "vue-chartjs";
export default {
  extends: Doughnut,
  props: { data: Object, options: Object },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart({
      data:{
        labels: ["Red", "Blue", "Yellow"],
      datasets: [
        {
          label: "My First Dataset",
          data: [300, 50, 100],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
      },
      options: {
        legend: {
          display: false,
          labels: {
            fontSize: 0,
          },
        },
      },
    });
  },
};
</script>
