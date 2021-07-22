<template>
  <section>
    <main-header />
    <router-view />
  </section>
</template>

<script>
import mainHeader from "./cmps/main-header.vue";
// import draggable from 'vuedraggable'

export default {
  components: {
    mainHeader,
    // draggable
  },
};
</script>

