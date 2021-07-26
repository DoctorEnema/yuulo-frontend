<template>
  <section @click.stop="openCard(group.id, card.id, (isEditCard = false))">
    <button
      ref="edit"
      class="edit-card-preview"
      @click.stop="openCard(group.id, card.id, (isEditCard = true), $event)"
    ></button>
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
      <div
        @click.stop="toggleLabels"
        v-if="isLabels"
        class="card-preview-labels"
      >
        <div v-for="(label, idx) in cardLabels" :key="idx">
          <div
            :class="{
              'preview-label-grow': isLabelGrow,
              'preview-label-shrink': !isLabelGrow,
            }"
            v-if="label"
            :style="{ backgroundColor: label.color }"
          >
            <span>{{ label.name }}</span>
          </div>
        </div>
      </div>
      <p class="card-preview-title">{{ card.title }}</p>
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
            <span class="to-user" v-else-if="member.fullname">{{
              member.fullname.charAt(0)
            }}</span>
            <span v-else>?</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {},
  props: {
    card: Object,
    group: Object,
    hardcodedBoardId: String,
  },
  data() {
    return {
      isEditCard: false,
      position: null,
    };
  },
  created() {
    // socketService.on()
  },
  destroyed() {},
  methods: {
    toggleLabels() {
      this.$store.commit("toggleLabels");
    },
    openCard(groupId, cardId, isEditCard, ev) {
          this.$store.commit({type:'setLoading', isLoading: true})

      const position = {
        posY: this.$refs.edit.getBoundingClientRect().top + window.scrollY,
        posX: this.$refs.edit.getBoundingClientRect().left + window.scrollX,
      };
      // this.$refs.edit.style.top =`${position.posY}`
      // this.$refs.edit.style.left =`${position.posX}`
      this.$store.commit({ type: "setPosition", position });
      this.$router.push(
        `/board/${this.selectedBoard._id}/${groupId}/${cardId}/${isEditCard}`
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
    isLabelGrow() {
      return this.$store.getters.isLabelOpen;
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