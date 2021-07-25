<template>
  <section>
    <div class="group-header">
      <form @submit.prevent="saveTitle">
        <!-- <textarea ref="title" @keydown.13.prevent @keyup.13="saveTitle" @blur="saveTitle" spellcheck="false">{{group.title}}</textarea> -->
        <div :class="titleEditMode" class="group-title">
          <p
            ref="title"
            @keydown.13.prevent
            @keyup.13="saveTitle"
            @blur="saveTitle"
            :contenteditable="isTitleEdit"
            @mouseup="startEdit"
            spellcheck="false"
          >
            {{ group.title }}
          </p>
        </div>
      </form>
      <!-- <p>{{group.title}}</p> -->
      <button @click="removeGroup(group.id)"></button>
    </div>
    <draggable
      class="group-content"
      :list="group.cards"
      group="cardGroup"
      @start="onDragStart"
      @end="onDragEnd"
      :animation="200"
      ghostClass="moving-card"
      :delay="170"
      :delayOnTouchOnly="true"
    >
      <card-preview
        @changeComplete="changeComplete"
        @removeCard="removeCard"
        class="card-preview"
        v-for="card in group.cards"
        :group="group"
        :card="card"
        :key="card.id"
        :hardcodedBoardId="hardcodedBoardId"
      ></card-preview>
    </draggable>
    <section class="add-card-area" v-if="isAdding">
      <textarea
        @keyup.enter="addCard(group.id)"
        placeholder="Enter a title for this card..."
        v-model="emptyCard.title"
        spellcheck="false"
      />
      <div class="add-card-controls">
        <button @click="addCard(group.id)">Add card</button>
        <button class="close-adding" @click="isAdding = false"></button>
      </div>
    </section>
    <div v-else class="group-footer">
      <button @click="isAdding = true">Add a card</button>
    </div>
  </section>
</template>

<script>
import cardPreview from "../card/card-preview.vue";
import draggable from "vuedraggable";
export default {
  props: { group: Object },
  components: {
    cardPreview,
    draggable,
  },
  data() {
    return {
      emptyCard: {
        title: "",
      },
      isAdding: false,
      hardcodedBoardId: "60f42b03d2f67fa6bfa0f528",
      isUpdated: false,
      isTitleEdit: false,
    };
  },
  computed: {
    copiedGroup() {
      return JSON.parse(JSON.stringify(this.group));
    },
    copiedEmptyCard() {
      return JSON.parse(JSON.stringify(this.emptyCard));
    },
    titleEditMode() {
      return { edit: this.isTitleEdit };
    },
  },
  methods: {
    saveTitle(ev) {
      if (this.isUpdated) return;
      const group = this.copiedGroup;
      group.title = this.$refs.title.innerText;
      this.$emit("updateGroup", group);
      this.$nextTick(() => (this.isUpdated = false));
      // setTimeout(() => (this.isUpdated = false), 100);
      console.log(ev);

      this.isUpdated = true;
      this.$refs.title.blur();

      this.isTitleEdit = false;
    },
    startEdit() {
      this.isTitleEdit = true;
      this.$nextTick(() => this.$refs.title.focus());
    },
    onDragStart(ev) {
      ev.item.classList.add("dragging");
    },
    onDragEnd(ev) {
      ev.item.classList.remove("dragging");
      this.$emit("onDragEnd");
    },
    removeGroup(groupId) {
      this.$emit("removeGroup", groupId);
    },
    removeCard(cardId) {
      this.$emit("removeCard", this.copiedGroup, cardId);
    },
    addCard(groupId) {
      if (!this.emptyCard.title) return;
      this.$emit("addCard", groupId, this.copiedEmptyCard);
      this.emptyCard.title = "";
      this.isAdding = false;
    },
    changeComplete(isComplete) {
      this.$emit("changeComplete", isComplete);
    },
  },
};
</script>