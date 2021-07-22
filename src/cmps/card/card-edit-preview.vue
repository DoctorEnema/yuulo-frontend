<template>
  <section class="card-edit-preview" @click="openCard(group.id, card.id)">
    <!-- <button
      class="edit-card-preview"
      @click.stop="removeCard(card.id)"
    ></button> -->
    <div v-if="card.cover">
      <div
        v-if="card.cover.color"
        :style="{ backgroundColor: card.cover.color }"
        class="card-preview-cover"
      ></div>
      <img class="card-preview-cover-img" v-else :src="card.cover.imgUrl" />
    </div>
    <div class="card-preview-content">
      <div v-if="isLabels" class="card-preview-labels">
        <div v-for="(label, idx) in cardLabels" :key="idx">
          <div v-if="label" :style="{ backgroundColor: label.color }"></div>
        </div>
      </div>
      <div class="card-preview-title">{{ card.title }}</div>
      <div class="card-preview-bottom">
        <div class="card-preview-badges">
          <div
            @click.stop="changeComplete()"
            v-if="card.dueDate"
            :class="{ 'date-done': card.dueDate.isComplete }"
            class="card-preview-date"
          >
            {{ date }}
          </div>
          <div v-if="card.description" class="card-preview-desc"></div>
          <div v-if="card.comments" class="card-preview-comments">
            {{ card.comments.length }}
          </div>
          <div v-if="isAttachments" class="card-preview-attachments">
            {{ card.attachments.length }}
          </div>
          <div
            :class="{ 'checklist-done': isChecklistDone }"
            v-if="isChecklists"
            class="card-preview-checklists"
          >
            {{ completedTodos }}/{{ numberOfTodos }}
          </div>
        </div>
        <div class="card-preview-members">
          <button
            class="card-preview-member"
            v-for="member in card.members"
            :key="member._id"
          >
            <img v-if="member.imgUrl" :src="member.imgUrl" />
            <span v-else>{{ member.fullname.charAt(0) }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    card: Object,
    group: Object,
    hardcodedBoardId: String,
  },
  created() {
    // socketService.on()
  },
  destroyed() {},
  methods: {
    removeCard(cardId) {
      this.$emit("removeCard", cardId);
    },
    openCard(groupId, cardId) {
      this.$router.push(
        `/board/${this.selectedBoard._id}/${groupId}/${cardId}`
      );
    },
    changeComplete() {
      this.currentCard.dueDate.isComplete =
        !this.currentCard.dueDate.isComplete;
      this.$store.dispatch({
        type: "updateCard",
        group: this.currentGroup,
        card: this.currentCard,
      });
    },
  },
  computed: {
    selectedBoard() {
      return this.$store.getters.selectedBoard;
    },
    currentGroup() {
      const idx = this.$store.getters.selectedBoard.groups.findIndex(
        (g) => this.group.id === g.id
      );
      return JSON.parse(
        JSON.stringify(this.$store.getters.selectedBoard.groups[idx])
      );
    },
    currentCard() {
      return JSON.parse(JSON.stringify(this.card));
    },
    numberOfTodos() {
      let sum = 0;
      this.card.checklists.forEach(
        (checklist) => (sum += checklist.todos.length)
      );
      return sum;
    },
    completedTodos() {
      let sum = 0;
      this.card.checklists.forEach((checklist) =>
        checklist.todos.forEach((todo) => {
          if (todo.isDone) sum++;
        })
      );
      return sum;
    },
    isAttachments() {
      if (!this.card.attachments || !this.card.attachments.length) return false;
      else return true;
    },
    isLabels() {
      if (!this.card.labelIds || !this.card.labelIds.length) return false;
      else return true;
    },
    isChecklists() {
      if (
        !this.card.checklists ||
        !this.card.checklists.length ||
        !this.card.checklists[0].todos ||
        !this.card.checklists[0].todos.length
      )
        return false;
      else return true;
    },
    isChecklistDone() {
      if (this.numberOfTodos === this.completedTodos) return "true";
    },
    date() {
      let time = new Date(this.card.dueDate.date);
      let shortMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      let day = time.getDate();
      return `${shortMonths[time.getMonth()]} ${day}`;
    },
    boardLabels() {
      const board = this.$store.getters.selectedBoard;
      return board.labels;
    },
    cardLabels() {
      const cardLabels = [];
      this.card.labelIds.forEach((label) => {
        const currLabel = this.boardLabels.filter((l) => l.id === label);
        cardLabels.push(currLabel[0]);
      });
      return cardLabels;
    },
  },
};
</script>

<style>
</style>