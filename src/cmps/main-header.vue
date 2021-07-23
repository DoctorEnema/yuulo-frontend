<template>
  <section>
    <div class="main-header">
      <div class="header-left">
        <router-link class="to-home" to="/"></router-link>
        <!-- <router-link class="to-boards" :to="'/board/'+currBoard"> Boards</router-link> -->

        <!-- <router-link @click="toggleMenu" class="to-boards" :to="'/board/b101'"> Boards</router-link> -->
        <button @click="toggleMenu" class="to-boards"> Boards</button>
        <div class="search">
          <input
            v-model="search"
            class="search-bar"
            type="search"
            placeholder="Jump to..."
          />
          <span class="search-glass"></span>
        </div>
      </div>
      <div class="logo">
        <div class="yuumi-header"></div>
        <!-- <h2>Yuulo</h2> -->
      </div>
      <div class="header-right">
        <button class="to-create-board" @click="toggleCreateBoard"></button>
        <!-- <button class="to-info"></button> -->
        <button
          @click="toggleNotifModal(), markRead()"
          class="to-notifications"
          :class="isNewNotifications"
        ></button>
        <button class="header-user">
          <div v-if="!loggedinUser">?</div>
          <img v-else-if="loggedinUser.imgUrl" :src="loggedinUser.imgUrl" />
          <div v-else-if="loggedinUser.fullname" class="to-user">
            {{ loggedinUser.fullname.charAt(0) }}
          </div>
        </button>
      </div>
    </div>
    <notifications
      v-if="isNotifOpen"
      :isNotifOpen="isNotifOpen"
      @toggleNotifModal="toggleNotifModal"
      @clearNotifications="clearNotifications"
    ></notifications>
    <board-menu
      @selectBoard="selectBoard"
      @toggleMenu="toggleMenu"
      v-if="isBoardMenu"
    ></board-menu>
    <add-board
      @createBoard="createBoard"
      @toggleCreateBoard="toggleCreateBoard"
      v-if="isCreate"
    ></add-board>
  </section>
</template>

<script>
import boardMenu from "../cmps/board/board-menu.vue";
import notifications from "./notifications.vue";
import addBoard from "./board/add-board.vue";
export default {
  components: {
    boardMenu,
    notifications,
    addBoard,
  },
  data() {
    return {
      search: "",
      isBoardMenu: false,
      currBoard: "",
      isNotifOpen: false,
      isCreate: false,
    };
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isNewNotifications() {
      if (!this.loggedinUser || !this.loggedinUser.notifications) return false;
      var isRead = false;
      if (this.isNotifOpen) return isRead;
      isRead = this.loggedinUser.notifications.some((n) => !n.isRead);
      return { active: isRead };
    },
  },
  methods: {
    toggleMenu() {
      this.isBoardMenu = !this.isBoardMenu;
    },
    selectBoard(boardId) {
      this.currBoard = boardId;
      this.isBoardMenu = !this.isBoardMenu;
      this.$router.push("/board/" + boardId);
    },
    toggleNotifModal() {
      this.isNotifOpen = !this.isNotifOpen;
    },
    clearNotifications(userId) {
      this.$store.dispatch({ type: "clearNotifications", userId });
    },
    markRead() {
      if (!this.loggedinUser) return;
      if (!this.isNotifOpen) return;
      this.$store.dispatch({ type: "markRead", userId: this.loggedinUser._id });
    },
    toggleCreateBoard() {
      this.isCreate = !this.isCreate;
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