<template>
  <section>
    <div v-if="!editMode" @click="setCurrTodo(todo)" class="todo-controls">
      <div class="checkmark">
        <input
        class="todo-checkbox"
          type="checkbox"
          @click.stop="checkTodo(todo)"
          :checked="todo.isDone"
        />
        <span >{{ todo.title }}</span>
      </div>
      <slot name="removeTodo"></slot>
    </div>
    <div v-else class="todo-edit">
      <textarea ref="textarea" v-model="currTodo.title"></textarea>
      <div class="todo-edit-controls">
        <button @click="editTodo">Save</button>
        <button @click="closeEdit"></button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    todo: Object,
  },
  mounted() {
    this.$root.$on("isEditMode", () => {
      this.editMode = false;
    });
  },
  destroyed() {
    this.$root.$off("isEditMode");
  },
  data() {
    return {
      currTodo: null,
      editMode: false,
    };
  },
  methods: {
    setCurrTodo(todo) {
      this.$root.$emit("isEditMode");
      this.currTodo = { ...todo };
      this.editMode = !this.editMode;
      this.$nextTick(() => {
        this.$refs.textarea.focus();
        this.$refs.textarea.select();
      });
    },
    closeEdit() {
      this.editMode = false;
    },
    editTodo() {
      this.editMode = !this.editMode;
      if (!this.currTodo.title) return;
      const todo = this.currTodo;
      this.$emit("editTodo", { ...todo });
      this.currTodo = null;
    },
    checkTodo(todo) {
      todo.isDone = !todo.isDone;
      this.$emit("editTodo", todo);
    },
  },
};
</script>

<style>
</style>