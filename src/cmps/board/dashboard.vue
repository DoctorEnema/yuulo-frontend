<template>
  <div class="card-details-container">
  <section
    v-click-outside="closeDashboard"
    class="dashboard"
    @click="closeDashboard"
  >
    <button class="close-dashboard"></button>
    <h1>Dashboard</h1>
    <div class="charts-container">
      <div class="dashboard-details">
        <div>
          <h4>{{ selectedBoard.members.length }}</h4>
          <h3 class="dash-members">Members</h3>
        </div>
        <div>
          <h4>{{ sumAllTasks }}</h4>
          <h3 class="dash-tasks">Total Tasks</h3>
        </div>
        <div>
          <h4>{{ tasksAssigned }}</h4>
          <h3 class="dash-assigned-tasks">Assigned tasks</h3>
        </div>
        <div>
          <h4>{{ showDate }}</h4>
          <h3 class="dash-date">Creation date</h3>
        </div>
      </div>
      <div class="chart-basic">
        <h2>Checklist Todos</h2>
        <chart-pie
          class="pie-chart"
          :data="chartDataToDo"
          :options="chartOptions"
        />
      </div>

      <div class="chart-basic">
        <h2>Tasks per members</h2>
        <chart-pie
          class="doughnut-chart"
          :data="chartDataMembers"
          :options="chartOptions"
        />
      </div>
      <div class="chart-basic">
        <h2>Tasks per group</h2>
        <chart-bar
          class="bar-chart"
          :data="chartBarCardSum"
          :options="chartBarOptions"
        />
      </div>
    </div>
  </section>
  </div>
</template>

<script>
// import VueCharts from 'vue-chartjs'
// import { Bar, Line } from 'vue-chartjs'
import chartBar from "./chart-bar.vue";
import chartDoughnut from "./chart-doughnut.vue";
import chartPie from "./chart-pie.vue";
import { utilService } from "../../services/util-service.js";
import vClickOutside from "v-click-outside";

export default {
  data() {
    return {
      chartOptions: {
        borderWidth: "10px",
        hoverBackgroundColor: "red",
        hoverBorderWidth: "10px",
        legend: {
          display: false,
          labels: {
            fontSize: 0,
          },
        },
      },
      chartBarOptions: {
        borderWidth: "10px",
        hoverBackgroundColor: "red",
        hoverBorderWidth: "10px",
        legend: {
          display: false,
          labels: {
            fontSize: 0,
          },
        },
        plugins: {},
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
      backgroundColor: [
        "#ff78cb",
        "#00c2e0",
        "#eb5a46",
        "#61bd4f",
        "#ff9f1a",
        "#0079bf",
      ],
    };
  },
  components: {
    chartBar,
    chartDoughnut,
    chartPie,
  },
  computed: {
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
    showDate() {
      var timestamp = this.selectedBoard.createdAt;
      var date = new Date(timestamp);

      return (
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
      );
    },
    showHours() {
      var timestamp = this.selectedBoard.createdAt;
      var date = new Date(timestamp);
      return date.getHours() + ":" + date.getMinutes();
    },
    sumAllTasks() {
      let sum = 0;
      this.selectedBoard.groups?.forEach((group) => {
        sum += group.cards?.length;
      });
      return sum;
    },
    tasksAssigned() {
      let sum = 0;
      this.selectedBoard.groups?.forEach((group) => {
        group.cards.forEach((card) => {
          sum += card.members?.length;
        });
      });
      return sum;
    },
    chartBarCardSum() {
      let groupTitels = [];
      let groupCards = [];

      this.selectedBoard.groups.forEach((group, groupIdx) => {
        let sum = 0;
        groupTitels.push(group.title);
        groupCards.push(sum);
        group.cards.forEach((card, idx) => {
          sum++;
          groupCards[groupIdx] = sum;
        });
      });
      return {
        labels: groupTitels,
        datasets: [
          {
            label: "",
            backgroundColor: groupTitels.map(
              (m, idx) => this.backgroundColor[idx]
            ),
            data: groupCards,
          },
        ],
      };
    },

    chartDataToDo() {
      let num = 0;
      let DoneToDo = 0;
      let undoneToDo = 0;
      const todos = [];
      this.selectedBoard.groups.forEach((group) => {
        group.cards.forEach((card) => {
          if (!card.checklists) return;
          card.checklists.forEach((checklist) => {
            checklist.todos.forEach((todo) => {
              if (todo.isDone === true) DoneToDo++;
              else undoneToDo++;
            });
          });
        });
      });
      todos.push(DoneToDo);
      todos.push(undoneToDo);
      return {
        labels: ["Finished todos", "Unfinished todo"],
        datasets: [
          {
            label: "Checklist",
            backgroundColor: ["#61bd4f", "#ff9f1a"],
            color: "white",
            data: todos,
          },
        ],
      };
    },
    chartDataMembers() {
      let membersCount = {};
      this.selectedBoard.groups.forEach((group) => {
        group.cards.forEach((card) => {
          card.members?.forEach((member) => {
            if (membersCount[member.fullname]) {
              membersCount[member.fullname] += 1;
            } else {
              membersCount[member.fullname] = 1;
            }
          });
        });
      });
      return {
        labels: Object.keys(membersCount),
        datasets: [
          {
            label: "Members",
            backgroundColor: Object.keys(membersCount).map(
              (m, idx) => this.backgroundColor[idx]
            ),
            data: Object.values(membersCount),
          },
        ],
      };
      // chartData() {
      //   return {
      //     labels: this.selectedBoard.map((t) => 't.name'),
      //     datasets: [
      //       {
      //         label: "Toys",
      //         backgroundColor: this.selectedBoard.map(() =>
      //           utilService.getRandomColor()
      //         ),
      //         data: this.selectedBoard.map((t) => 't.price'),
      //       },
      //     ],
      //   };
    },
  },
  methods: {
    closeDashboard() {
      this.$router.push(`/board/${this.selectedBoard._id}`);
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
};
</script>

<style>
</style>