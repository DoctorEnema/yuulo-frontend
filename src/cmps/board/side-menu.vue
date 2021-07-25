<template>
  <section v-click-outside="toggleMenu" class="side-menu">
    <div class="add-card-header side-menu-header">
      <h3 v-if="!isActivityModal">Menu</h3>
      <h3 v-else>Change background</h3>
      <button @click="toggleMenu"></button>
      <div
        v-if="isActivityModal"
        class="side-menu-back"
        @click="coverModal"
      ></div>
    </div>
    <hr />
    <div class="side-menu-content">
      <button v-if="!isActivityModal" @click="coverModal">
        Change background
      </button>
      <board-cover
        @boardCoverColor="boardCoverColor"
        @boardCoverImage="boardCoverImage"
        v-if="isCoverModal"
      ></board-cover>
      <hr />
      <div class="side-menu-activity" v-if="!isActivityModal">
        <h3>Activity</h3>
        <!-- {{selectedBoard.activities}} -->
        <div v-for="activity in selectedBoard.activities" :key="activity.id">
          <div class="activity">
            <div>
              <img
                v-if="activity.byMember.imgUrl"
                :src="activity.byMember.imgUrl"
              />
              <div
                v-else-if="activity.byMember.fullname"
                class="to-user side-menu-user"
              >
                {{ activity.byMember.fullname.charAt(0) }}
              </div>
              <div v-else>?</div>
            </div>
            <span class="member-name">{{ activity.byMember.fullname }}</span>
            <span><span> </span> {{ activity.txt }}</span>
            <show-time
              class="activity-time"
              :time="activity.creatAt"
            ></show-time>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import showTime from "../card/show-time.vue";
import boardCover from "./board-cover.vue";
import vClickOutside from 'v-click-outside';
export default {
  data() {
    return {
      isCoverModal: false,
      isActivityModal: false,
    };
  },
  components: {
    showTime,
    boardCover,
  },
  computed: {
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
    firstLetter() {
      return this.activity.byMember.fullname.charAt(0);
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
  },
    directives: {
      clickOutside: vClickOutside.directive
    },
};
</script>

<style>
</style>