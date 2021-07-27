<template>
  <section v-if="board" class="board-container">
    <div
      v-if="this.board.style.backgroundImg"
      class="background"
      :style="{
        'background-image': 'url(' + this.board.style.backgroundImg + ')',
      }"
    />
    <div
      v-if="this.board.style.backgroundColor"
      class="background"
      :style="{
        'background-color': this.board.style.backgroundColor,
      }"
    />
    <div class="board-header">
      <div class="main-header-side">
        <button class="dashboard-icon" @click="openDashboard">
          <!-- <h2>{{ board.title }}</h2> -->
        </button>
        <button v-if="loggedinUser"
          @click="toggleFavBoard(boardId)"
          class="favorite-board"
          :style="{color:isFavoritedBoard}"
        ></button>
        <div class="board-members">
          <button
            class="board-member-header"
            v-for="member in board.members"
            :key="member._id"
          >
            <div  v-if="member.imgUrl"><img :src="member.imgUrl" /></div>
            <div v-else-if="member.fullname" class="to-user">
              {{ member.fullname.charAt(0) }}
            </div>
            <div v-else class="to-user">?</div>
          </button>
        </div>
        <button class="members-btn" @click="toggleMemberModal"></button>
        <div   v-click-outside="toggleMemberModal" v-if="isMember" class="invite-member">
          <header class="add-card-header">
            <h4>Invite to board</h4>
            <button @click="toggleMemberModal"></button>
          </header>
          <hr />
          <div class="invite-members-content" v-if="users">
            <input type="text" placeholder="Person to invite" />
            <button
              v-for="user in users"
              :key="user._id"
              @click="addMember(user)"
            >
              <img v-if="user.imgUrl" class="img-invite" :src="user.imgUrl" alt="" />
              <div v-else-if="user.fullname" class="to-user">{{user.fullname.charAt(0)}}</div>
              <div v-else>G</div>
              {{ user.fullname }}
              <span v-if="isMemberPicked(user)" class="icon"> ✔</span>
            </button>
          </div>
        </div>
      </div>
      <button class="show-board-menu" @click="toggleMenu"> Show menu</button>
      <transition name="go-side">
        <side-menu
          @boardCoverColor="boardCoverColor"
          @boardCoverImage="boardCoverImage"
          v-if="isSideMenu"
          @toggleMenu="toggleMenu"
        ></side-menu>
      </transition>
    </div>
    <div class="board-content">
      <div class="groups-and-add">
        <draggable
          class="groups"
          :list="board.groups"
          @start="onDragStart"
          @end="onDragEnd"
          :animation="200"
          ghostClass="moving-group"
          chosenClass="group-moving"
          :delay="140"
          :delayOnTouchOnly="true"
        >
          <group
            @removeCard="removeCard"
            @removeGroup="removeGroup"
            @addCard="addCard"
            v-for="group in board.groups"
            class="group"
            :group="group"
            :key="group.id"
            @onDragEnd="onDragEnd"
            @updateGroup="updateGroup"
          ></group>
        </draggable>
        <div class="adding-group" v-if="isAdding">
          <input
            v-model="emptyGroup.title"
            type="text"
            placeholder="Enter group title..."
            @keyup.enter="addGroup(copiedGroup)"
            spellcheck="false"
          />
          <div class="add-group-controls">
            <button @click="addGroup(copiedGroup)">Add group</button>
            <button @click="toggleAdding"></button>
          </div>
        </div>
        <button class="add-group" v-else @click="toggleAdding">
          Add another group
        </button>
      </div>
    </div>
    <!-- <yuumi class="yuumi"></yuumi> -->
    <router-view></router-view>
  </section>
</template>

<script>
import { boardService } from "../services/board-service.js";
import group from "../cmps/group/group.vue";
import draggable from "vuedraggable";
import activities from "../cmps/card/activities.vue";
import sideMenu from "../cmps/board/side-menu.vue";
import { userService } from "../services/user-service.js";
import yuumi from "../cmps/yuumi.vue";
import vClickOutside from 'v-click-outside';
export default {
  components: {
    group,
    activities,
    sideMenu,
    draggable,
    yuumi,
  },
  async created() {
    try {
      this.$store.dispatch({ type: "loadBoard", boardId: this.boardId });
      await this.$store.dispatch({ type: "loadUsers" });
    } catch (err) {
      console.log("cannot load users", err);
    }
    try {
      const user = await userService.checkIfLoggedInUser();
    if (user){
      this.$store.commit({ type: "setLoggedinUser", user })
      this.$store.dispatch({ type: "loadUserCardWatch", userId: user._id })
       }
    } catch (err) {
      console.log('no google user signed in');
    }
    this.setUpdatedLoggedInUser();
    socketService.emit("board topic", this.boardId);
    if (this.loggedinUser) {
      this.$store.dispatch({
        type: "loadUserCardWatch",
        userId: this.loggedinUser._id,
      });
    }
    window.document.title = `Yuulo`;
    this.$store.dispatch({ type: "getUnsplash", query: "newyork" });
    // addEventListener('touchstart', ()=>{
    //   this.isShortTap =true
    // })
  },
  data() {
    return {
      // selectedBoard: null,
      isAdding: false,
      emptyGroup: {
        title: "",
        style: {},
        cards: [],
      },
      isSideMenu: false,
      isMember: false,
      isShortTap: false,
    };
  },
  computed: {
    board() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
    boardId() {
      return this.$route.params.boardId;
    },
    copiedGroup() {
      return JSON.parse(JSON.stringify(this.emptyGroup));
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    users() {
      return this.$store.getters.users;
    },
    isFavoritedBoard(){
      if (this.loggedinUser.favBoardIds?.some(bId => bId === this.boardId)) return 'gold'
      else return 'white'
    },
    
  },
  methods: {
     isMemberPicked(member) {
      if (!this.board.members) return;
      return this.board.members.some((m) => m._id === member._id);
    },
    openDashboard() {
      this.$router.push(`/board/${this.board._id}/dashboard`);
    },
    async removeMember(memberId){
    console.log("memberId", memberId)
 await this.$store.dispatch({
        type: "removeMember",
        memberId: memberId,
      });
    },
    async addMember(user) {
         if (this.board.members.some((m) => m._id === user._id)) {
        this.removeMember(user._id);
        return;
      }
      const member = {
        fullname: user.fullname,
        _id: user._id,
        imgUrl: user.imgUrl,
      };
      await this.$store.dispatch({
        type: "addMember",
        member: member,
      });
    },
    toggleMemberModal() {
      this.isMember = !this.isMember;
    },
    onDragStart() {
      console.log("start");
    },
    onDragEnd() {
      const board = this.board;
      this.$store.commit({ type: "setBoard", board });
      this.$store.dispatch({ type: "updateBoard", board });
    },
    updateGroup(group) {
      console.log("group", group);
      this.$store.dispatch({ type: "updateGroup", board: this.board, group });
    },
    removeGroup(groupId) {
      this.$store.dispatch({ type: "removeGroup", groupId });
    },
    addGroup(group) {
      if (!group.title) return;
      this.$store.dispatch({ type: "addGroup", group });
      this.emptyGroup.title = "";
      this.isAdding = false;
    },
    removeCard(group, cardId) {
      this.$store.dispatch({
        type: "removeCard",
        board: this.board,
        group,
        cardId,
      });
    },
    addCard(groupId, card) {
      this.$store.dispatch({
        type: "addCard",
        board: this.board,
        groupId,
        card,
      });
    },
    toggleAdding() {
      this.isAdding = !this.isAdding;
    },
    toggleMenu() {
      this.isSideMenu = !this.isSideMenu;
    },
    boardCoverImage(img) {
      const board = this.board;
      board.style.backgroundImg = img;
      board.style.backgroundColor = null;
      this.$store.dispatch({ type: "updateBoard", board });
    },
    boardCoverColor(cover) {
      const board = this.board;
      board.style.backgroundColor = cover.color;
      board.style.backgroundImg = null;
      this.$store.dispatch({ type: "updateBoard", board });
    },
    async setUpdatedLoggedInUser() {
      try {
        const user = await userService.getById(this.loggedinUser._id);
        this.$store.commit({ type: "setLoggedinUser", user });
      } catch (err) {
        console.log("cannot get user", err);
      }
    },
    toggleFavBoard(boardId) {
      const copiedUser = JSON.parse(JSON.stringify(this.loggedinUser));
      const idx = this.loggedinUser.favBoardIds?.findIndex(
        (bId) => bId === boardId
      );
      if (!this.loggedinUser.favBoardIds || idx === -1) {
        copiedUser.favBoardIds
          ? copiedUser.favBoardIds.push(boardId)
          : (copiedUser.favBoardIds = [boardId]);
        this.$store.dispatch({ type: "updateUser", user: copiedUser });
      } else {
        copiedUser.favBoardIds.splice(idx, 1);
        this.$store.dispatch({ type: "updateUser", user: copiedUser });
      }
    },
  },
  directives: {
      clickOutside: vClickOutside.directive
    },
};
</script>
