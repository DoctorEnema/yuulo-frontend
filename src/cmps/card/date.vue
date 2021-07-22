<template>
  <section class="date">
    <span>
      <input
        type="checkbox"
        @click.stop="checkDate(card)"
        :checked="card.dueDate.isComplete"
      />
      <button data-cmp="add-date" @click.stop="setModalType">
        {{ time }}
        <span class="is-complete" v-if="card.dueDate.isComplete"
          >COMPLETE
        </span>
      </button>
    </span>
  </section>
</template>

<script>
export default {
  props: {
    card: Object,
  },
  computed: {
    time() {
      // return new Date(this.card.dueDate.date)
      const date = new Date(this.card.dueDate.date);
      return `${(new Date(date).getDate() + "").padStart(2, "0")}/${(
        new Date(date).getMonth() +
        1 +
        ""
      ).padStart(2, "0")}/${new Date(date).getFullYear() + ""} ${(
        new Date(date).getHours() + ""
      ).padStart(2, "0")}:${(new Date(date).getMinutes() + "").padStart(
        2,
        "0"
      )}`;
    },
  },
  methods: {
    setModalType(ev) {
      this.$emit("setModalType", ev);
    },
    checkDate(card) {
      card.dueDate.isComplete = !card.dueDate.isComplete;
      this.$emit("changeComplete", card.dueDate.isComplete);
    },
  },
};
</script>

<style>
</style>