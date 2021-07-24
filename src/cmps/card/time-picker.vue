<template>
  <section class="time-picker">
    <div class="hours">
      <button @click="upHour">+</button>
      <p><span v-if="hour < 10">0</span>{{ hour }}</p>
      <button @click="downHour">-</button>
    </div>
    <div class="min">
      <button @click="upMin">+</button>
      <p><span v-if="min < 10">0</span>{{ min }}</p>
      <button @click="downMin">-</button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      hour: 12,
      min: 0,
    };
  },
  created(){
  },
  methods: {
    upHour() {
      this.hour++;
      if (this.hour === 25) this.hour = 1;
      this.setTime();
    },
    downHour() {
      this.hour--;
      if (this.hour === 0) this.hour = 24;
      this.setTime();
    },
    upMin() {
      this.min++;
      if (this.min === 60) {
        this.min = 0;
        this.hour++;
      }
      this.setTime();
    },
    downMin() {
      this.min--;
      if (this.min < 0) {
        this.min = 59;
        this.hour--;
      }
      this.setTime();
    },
    setTime() {
      let strHour = this.hour+'';
      let strMin = this.min+'';
      const newMin= strMin.padStart(2, '0')
      const newHour= strHour.padStart(2, '0')
      
      let time = `T${newHour}:${newMin}:00`;
      this.$emit('setTime',time)
    },
  },
};
</script>

<style>
</style>