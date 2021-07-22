
<template>
  <section class="board-menu">
    <div class="board-menu-header">
      <input type="text" placeholder="Find boards by name..." />
      <button @click="toggleMenu"></button>
    </div>
    <div class="starred-boards">Starred Boards</div>
    <add-board
      @createBoard="createBoard"
      @toggleCreateBoard="toggleCreateBoard"
      v-if="isCreate"
    ></add-board>
    <div class="board-menu-content">
      <div
        v-for="board in boards"
        :key="board._id"
        @click="selectBoard(board._id)"
      >
        <button
          class="board-bar"
          v-if="board.style"
          :style="{ backgroundImage: 'url(' + board.style.backgroundImg + ')' }"
        >
          <section class="diffuser">{{ board.title }}</section>
          <img
            v-if="board.style.backgroundImg"
            :src="board.style.backgroundImg"
          />
          <div
            class="board-bar-color"
            v-else
            :style="{ backgroundColor: board.style.backgroundColor }"
          ></div>
          <button
            v-if="'60f42b03d2f67fa6bfa0f528' !== board._id"
            @click.stop="removeBoard(board._id)"
            class="board-remove"
          ></button>
        </button>
      </div>
    </div>
    <a href="#" @click="toggleCreateBoard">Create new board...</a>
  </section>
</template>

<script>
import addBoard from "../board/add-board.vue";

export default {
  data() {
    return {
      isCoverModal: false,
      isActivityModal: false,
      isCreate: false,
    };
  },
  async created() {
    try {
      await this.$store.dispatch({ type: "loadBoards" });
    } catch (err) {
      console.log("cannot load boards", err);
    }
  },
  components: {
    addBoard,
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
    selectedBoard() {
      return this.$store.getters.selectedBoard;
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    boardIdParams() {
      return this.$route.params.boardId;
    },
  },
  methods: {
    toggleMenu() {
      this.$emit("toggleMenu");
    },
    coverModal() {
      this.isCoverModal = !this.isCoverModal;
      this.isActivityModal = !this.isActivityModal;
    },
    boardCoverImage(img) {
      this.$emit("boardCoverImage", img);
    },
    boardCoverColor(color) {
      this.$emit("boardCoverColor", color);
    },
    toggleCreateBoard() {
      this.isCreate = !this.isCreate;
    },
    async selectBoard(boardId) {
      if (boardId === this.selectedBoard?._id) return;
      const board = await this.$store.dispatch({ type: "loadBoard", boardId });
      this.$emit("selectBoard", boardId);
    },
    async removeBoard(boardId) {
      if ("60f42b03d2f67fa6bfa0f528" === boardId) return;
      if (boardId === this.boardIdParams) this.$router.push("/");
      await this.$store.dispatch({ type: "removeBoards", boardId });
      await this.$store.dispatch({ type: "loadBoards" });
    },
    async createBoard(title, imgUrl) {
      const board = {
        title: title,
        createdAt: Date.now(),
        createdBy: this.loggedInUser,
        style: { backgroundImg: imgUrl },
        covers: [
          {
            id: "c101",
            imgUrl:
              "https://res.cloudinary.com/davidyan7/image/upload/v1625997002/samples/landscapes/beach-boat.jpg",
          },
          {
            id: "c102",
            imgUrl:
              "https://res.cloudinary.com/davidyan7/image/upload/v1625997005/samples/landscapes/nature-mountains.jpg",
          },
          {
            id: "c103",
            imgUrl:
              "https://res.cloudinary.com/davidyan7/image/upload/v1625997001/samples/landscapes/architecture-signs.jpg",
          },
          {
            id: "c104",
            imgUrl:
              "https://res.cloudinary.com/davidyan7/image/upload/v1625996999/samples/landscapes/girl-urban-view.jpg",
          },
          {
            id: "c105",
            imgUrl:
              "https://res.cloudinary.com/davidyan7/image/upload/v1626442129/download-3_o4vbyr.jpg",
          },
          {
            id: "c106",
            imgUrl:
              "https://res.cloudinary.com/davidyan7/image/upload/v1626442129/download-4_enj2yk.jpg",
          },
        ],
        labels: [
          {
            id: 100,
            name: "done",
            color: "#61bd4f",
            isPicked: false,
          },
          {
            id: 101,
            name: "patrial",
            color: "#ff9f1a",
            isPicked: false,
          },
          {
            id: 102,
            name: "todo",
            color: "#eb5a46",
            isPicked: false,
          },
          {
            id: 103,
            name: null,
            color: "#c377e0",
            isPicked: false,
          },
          {
            id: 104,
            name: null,
            color: "#0079bf",
            isPicked: false,
          },
          {
            id: 105,
            name: null,
            color: "#00c2e0",
            isPicked: false,
          },
          {
            id: "7j511",
            name: null,
            color: "#f2d600",
            isPicked: true,
          },
        ],
        members: [this.loggedInUser],
        groups: [],
        activities: [],
      };
      const newBoardId = await this.$store.dispatch({
        type: "addBoard",
        board,
      });
      this.$router.push("/board/" + newBoardId);
      this.$store.dispatch({ type: "loadBoards" });
      this.$store.dispatch({ type: "loadBoard", boardId: newBoardId });
    },
  },
};
</script>

