<template>
  <section class="dashboard" @click="closeDashboard">
    <button class="close-dashboard"></button>
    <h1>Dashboard</h1>
    <div class="charts-container">
        <div class="dashboard-details">
          <h2>Board details:</h2>
          <h3>Board title: {{selectedBoard.title}}</h3>
          <h3>Members: {{selectedBoard.members.length}}</h3>
          <h3>Created at: {{showTime}}</h3>
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
</template>

<script>
// import VueCharts from 'vue-chartjs'
// import { Bar, Line } from 'vue-chartjs'
import chartBar from "./chart-bar.vue";
import chartDoughnut from "./chart-doughnut.vue";
import chartPie from "./chart-pie.vue";
import { utilService } from "../../services/util-service.js";

export default {
  data() {
    return {
       chartOptions: {
        borderWidth: "10px",
        hoverBackgroundColor: "red",
        hoverBorderWidth: "10px",
       },
      chartBarOptions: {
        borderWidth: "10px",
        hoverBackgroundColor: "red",
        hoverBorderWidth: "10px",
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
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(47, 145, 50)",
        "rgb(205, 96, 0)",
        "rgb(171, 0, 205)",
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
    showTime() {
           var timestamp = this.selectedBoard.createdAt
        var date = new Date(timestamp);

return(date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+
          ":"+date.getMinutes()+
          ":"+date.getSeconds());
        },
    chartBarCardSum() {
      let groupTitels = [];
      console.log("groupTitels", groupTitels.length)
      let groupCards = [];
      
      this.selectedBoard.groups.forEach((group,groupIdx) => {
        let sum = 0
        groupTitels.push(group.title);
        groupCards.push(sum)
        group.cards.forEach((card, idx) => {
          sum++
           groupCards[groupIdx] = sum
        });
      });
       return {
        labels: groupTitels,
        datasets: [
          {
            label: "",
            backgroundColor:groupTitels.map(
              (m, idx) => this.backgroundColor[idx]),
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
            backgroundColor: ["rgb(47, 145, 50)", "rgb(255, 99, 132)"],
            data: todos,
          },
        ],
      };
    },
    chartDataMembers() {
      let membersCount = {};
      this.selectedBoard.groups.forEach((group) => {
        group.cards.forEach((card) => {
          card.members.forEach((member) => {
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
};
</script>

<style>
</style>