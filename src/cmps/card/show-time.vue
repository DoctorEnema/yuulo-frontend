<template>
  <section>
    {{ showTime }}
  </section>
</template>

<script>
export default {
  props: {
    time: Number,
  },
  computed: {
    showTime() {
      var actionLogged = this.time;
      var now = Date.now();
      var time = now - actionLogged;
      var exactTime = `${(new Date(actionLogged).getDate() + '').padStart(2, '0')}/${(new Date(actionLogged).getMonth() + 1 + '').padStart(2, '0')}/${new Date(actionLogged).getFullYear() + ''} ${(new Date(actionLogged).getHours() + '').padStart(2, '0')}:${(new Date(actionLogged).getMinutes() + '').padStart(2, '0')}`
        // console.log((new Date(actionLogged).getDate() + '').padStart(2, '0'));
      if (time < 10000) return "just now";
      if (time < 60000) return "a few seconds ago";
      if (time < 3600000) return new Date(time).getMinutes() + " minutes ago";
      if (time > 3600000 && time < 86400000)
        return new Date(time).getHours() + " hours ago";
      else return exactTime;
    },
  },
};
</script>

<style>
</style>