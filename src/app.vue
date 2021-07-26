<template>
  <section>
    <main-header />
    <router-view />
  </section>
</template>

<script>
import mainHeader from "./cmps/main-header.vue";

export default {
  components: {
    mainHeader,
  },
};
</script>

