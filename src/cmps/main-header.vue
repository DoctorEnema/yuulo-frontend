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
        <h2>Yuulo</h2>
      </div>
      <div class="header-right">
        <button class="to-create-board"></button>
        <button class="to-info"></button>
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
  </section>
</template>

<script>
import boardMenu from "../cmps/board/board-menu.vue";
import notifications from "./notifications.vue";
export default {
  components: {
    boardMenu,
    notifications,
  },
  data() {
    return {
      search: "",
      isBoardMenu: false,
      currBoard: "",
      isNotifOpen: false,
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
  },
};
</script>