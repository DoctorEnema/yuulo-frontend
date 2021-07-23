<template>
  <section class="dashboard" @click="closeDashboard">
    <button class="close-dashboard"></button>
    <h1>Dashboard</h1>
    <div class="charts-container">
    <chart-bar class="bar-chart" :data="chartDataToDo" :options="chartOptions"/>
    <chart-doughnut class="doughnut-chart"/>
    <div>
    <h1>Tasks per members</h1>
    <chart-pie class="doughnut-chart" :data="chartDataMembers" :options="chartOptions"/>
    </div>
    </div>
  </section>
</template>

<script>
// import VueCharts from 'vue-chartjs'
// import { Bar, Line } from 'vue-chartjs'
import chartBar from './chart-bar.vue'
import chartDoughnut from './chart-doughnut.vue'
import chartPie from './chart-pie.vue'
import {utilService} from '../../services/util-service.js'

export default {
  data() {
    return {
      chartOptions: {
        borderWidth: "10px",
        hoverBackgroundColor: "red",
        hoverBorderWidth: "10px",
      },
    };
  },
  components: {
    chartBar,
    chartDoughnut,
    chartPie
  },
  computed: {
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
    chartDataToDo(){
      let DoneToDo = 0
      let undoneToDo = 0
      const todos = []
      this.selectedBoard.groups.forEach(group=>{
        group.cards.forEach(card=>{
          if(!card.checklists) return
          card.checklists.forEach((checklist) => {
            checklist.todos.forEach(todo=>{
              if (todo.isDone ===true)DoneToDo++
              else undoneToDo++
            })
      })
        })
      })
      todos.push(DoneToDo)
      todos.push(undoneToDo)
      return {
        labels: ['Done todo','undone todo'],
        datasets: [
          {
            label: "Checklist",
            backgroundColor: todos.map(() => utilService.getRandomColor()),
            data: todos,
          },
        ],
      };
           
      
    },
    chartDataMembers() {
      let membersCount = {};
      this.selectedBoard.groups.forEach(group=>{
        group.cards.forEach(card=>{
          card.members.forEach((member) => {
        if (membersCount[member.fullname]) {
          membersCount[member.fullname] += 1;
        } else {
          membersCount[member.fullname] = 1;
        }
      })
        })
      })
      console.log(membersCount);
      return {
        labels: Object.keys(membersCount),
        datasets: [
          {
            label: "Members",
            backgroundColor: Object.keys(membersCount).map(() => utilService.getRandomColor()),
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