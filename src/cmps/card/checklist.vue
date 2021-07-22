<template>
  <section class="checklist">
    <span class="details-checklist-icon"></span>
    <div class="checklist-header">
      <h4>{{ checklist.title }}</h4>
      <button>Hide checked items</button>
      <button @click="removeList">Delete</button>
    </div>
    <div class="completion">
      <span class="completion-percent">{{ complete }}</span>
      <div class="progress-bar">
        <div class="bar" :style="'width:' + complete">
          <div class="precentage"></div>
        </div>
      </div>
    </div>
    <ul>
      <li v-for="todo in checklist.todos" :key="todo.id">
        <todo-preview @editTodo="editTodo" :todo="todo">
          <template v-slot:removeTodo>
            <button @click.stop="removeTodo(todo)"></button>
          </template>
        </todo-preview>
      </li>
    </ul>
    <button class="add-todo-btn" v-if="!addMode" @click="openTextarea">
      Add an item
    </button>
    <section class="todo-add" v-if="addMode">
      <textarea
        ref="textarea"
        v-model="todo.title"
        placeholder="Add an item"
      ></textarea>
      <div class="todo-add-controls">
        <button class="add-btn" @click="addTodo">Add</button>
        <button @click="closeTextarea"></button>
      </div>
    </section>
  </section>
</template>

<script>
import { boardService } from "../../services/board-service.js";
import todoPreview from "./todo-preview";

export default {
  props: {
    checklist: Object,
  },
  components: {
    todoPreview,
  },
  mounted() {
    this.$root.$on("checklistTextClose", () => {
      this.addMode = false;
    });
  },
  destroyed() {
    this.$root.$off("checklistTextClose");
  },
  data() {
    return {
      todo: boardService.getEmptyTodo(),
      addMode: false,
    };
  },
  methods: {
    openTextarea() {
      this.$root.$emit("checklistTextClose");
      this.addMode = true;
      this.$nextTick(() => {
        this.$refs.textarea.focus();
        this.$refs.textarea.select();
      });
    },
    closeTextarea() {
      this.addMode = false;
    },
    addTodo() {
      if (!this.todo.title) return;
      this.checklist.todos.push({ ...this.todo });
      this.$emit("addTodo", this.checklist);
      this.todo = boardService.getEmptyTodo();
    },
    editTodo(todo) {
      const idx = this.checklist.todos.findIndex((t) => t.id === todo.id);
      this.checklist.todos.splice(idx, 1, todo);
      this.$emit("addTodo", this.checklist);
    },
    removeTodo(todo) {
      const idx = this.checklist.todos.findIndex((t) => t.id === todo.id);
      this.checklist.todos.splice(idx, 1);
      this.$emit("addTodo", this.checklist);
    },
    removeList() {
      this.$emit("removeList", this.checklist.id);
    },
  },
  computed: {
    complete() {
      var todosLength = this.checklist.todos.length;
      var complete = this.checklist.todos.filter((todo) => todo.isDone);
      if (!complete.length) return "0%";
      return parseInt((complete.length / todosLength) * 100) + "%";
    },
  },
};
</script>

<style>
</style>