<template>
  <section class="add-to-card">
    <section class="add-checklist">
      <header class="add-card-header">
        <h3>Add checklist</h3>
        <button @click="closeModal"></button>
      </header>
      <hr />
      <div>
        <form @submit.prevent="setList(), closeModal()" >
          <label for="checklist"></label>
          <h4>Title</h4>
          <input ref="check" id="checklist" v-model="listname" type="text" />
          <button class="add-checklist-btn">Add</button>
        </form>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  created() {},
  mounted() {
    this.$refs.check.focus();
  },
  data() {
    return {
      listname: "Checklist",
    };
  },
  methods: {
    setList() {
      this.$emit("listAdded", this.listname);
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style>
</style>