<template>
  <section class="home">
    <header class="home-header">
      <div class="home-logo">
        <img src="@/assets/img/yuulo1.png" />
        <!-- <h1>Yuulo</h1> -->
      </div>
      <div class="home-header-user" v-if="loggedinUser">
        <h3>Hello, {{ loggedinUser.fullname }}</h3>
        <button @click="logout">Logout</button>
      </div>
      <div v-else class="home-header-btns">
        <button @click="loginPage">Log in</button>
        <button @click="signupPage">Sign up</button>
      </div>
    </header>
    <div class="background"></div>
    <div v-if="userOrModal" class="yuumi-container">
      <yuumi></yuumi>
    </div>
    <div v-if="userOrModal" class="hero">
      <!-- <h2>Yuulo helps you stay organized and be productive.</h2> -->
      <h2>Everything your team needs, all in one place.</h2>
      <h3>
        Yuulo is more than a way to stay organized - it's a smart workplace
        where teams, tools and productivity come together.
      </h3>
      <button @click="loginAsGuest">Try it as a guest</button>
      <img src="@/assets/img/main.png" alt="" />
    </div>
    <login-user
      @closeModal="displayModal = false"
      v-if="displayModal"
      :isSignup="isSignup"
    ></login-user>
    <div v-if="boards">
      <div class="home-boards" v-if="loggedinUser">
        <div class="boards-username">
          <img v-if="loggedinUser.imgUrl" :src="loggedinUser.imgUrl" />
          <div class="to-user" v-else-if="loggedinUser.fullname">
            {{ loggedinUser.fullname.charAt(0) }}
          </div>
          <h2>{{ loggedinUser.fullname.split(" ")[0] }}'s boards</h2>
        </div>
        <div v-if="favBoards.length">
        <h2 class="boards-headline">Starred boards</h2>
          <div v-if="boards" class="board-display starred">
            <button
              class="board-btn"
              @click="selectBoard(board._id)"
              v-for="board in favBoards"
              :key="board._id"
            >
              <h2>{{ board.title }}</h2>
              <img
                v-if="board.style.backgroundImg"
                :src="board.style.backgroundImg"
              />
              <div
                v-else
                :style="{ backgroundColor: board.style.backgroundColor }"
              ></div>
            </button>
          </div>
        </div>
        <h2 class="boards-headline">My boards</h2>
        <div class="board-display all-boards">
          <button
            class="board-btn"
            @click="selectBoard(board._id)"
            v-for="board in boards"
            :key="board._id"
          >
            <h2>{{ board.title }}</h2>
            <img
              v-if="board.style.backgroundImg"
              :src="board.style.backgroundImg"
            />
            <div
              v-else
              :style="{ backgroundColor: board.style.backgroundColor }"
            ></div>
          </button>
        </div>
      </div>
    </div>
    <div v-if="loggedinUser" class="yuumi-container">
      <yuumi></yuumi>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import loginUser from "../cmps/login-user.vue";
import yuumi from "../cmps/yuumi.vue";
import { userService } from "../services/user-service.js";
export default {
  name: "home",
  components: {
    loginUser,
    yuumi,
  },
  data() {
    return {
      displayModal: false,
      isSignup: false,
    };
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    userOrModal() {
      if (this.loggedinUser || this.displayModal) return false;
      else return true;
    },
    boards() {
      return this.$store.getters.boards;
    },
    favBoards() {
      const favoritedBoards = [];
      this.loggedinUser?.favBoardIds?.forEach((boardId) =>
        favoritedBoards.push(
          ...this.boards.filter((board) => board._id === boardId)
        )
      );
      return favoritedBoards;
    },
  },
  methods: {
    loginPage() {
      this.displayModal = true;
      this.isSignup = false;
    },
    signupPage() {
      this.displayModal = true;
      this.isSignup = true;
    },
    async loginAsGuest() {
      try {
        const user = await this.$store.dispatch({
          type: "login",
          userCred: { username: "Guest", password: "1234" },
        });
        this.$store.dispatch({ type: "loadUserCardWatch", userId: user._id });
      } catch (err) {
        console.log("cannot login", err);
      }
    },
    logout() {
      this.$store.dispatch({ type: "logout" });
    },
    async selectBoard(boardId) {
      const board = await this.$store.dispatch({ type: "loadBoard", boardId });
      this.$router.push("/board/" + boardId);
    },
    async setUpdatedLoggedInUser() {
      try {
        const user = await userService.getById(this.loggedinUser._id);
        this.$store.commit({ type: "setLoggedinUser", user });
      } catch (err) {
        console.log("cannot get user", err);
      }
    },
  },
  created() {
    this.$store.commit({ type: "clearBaord" });
    this.$store.dispatch("loadBoards");
    if(this.loggedinUser) this.setUpdatedLoggedInUser();
  },
  mounted() {
    document.title = `Yuulo - Home`;
  },
};
</script>
