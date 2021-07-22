<template>
  <div v-if="isModalOpen" class="">
    <div class="board-cover-btns">
      <button @click="colorModal"><h3>Colors</h3></button>
      <button @click="photoModal"><h3>Photos</h3></button>
    </div>
    <form v-if="isColors" @submit.prevent="setCoverColor()">
      <!-- <label for="name">colors</label> -->
      <h3>Colors</h3>
      <ul class="side-menu-colors">
        <li
          class="side-menu-color"
          v-for="(label, idx) in editCovers"
          :key="idx"
          :style="'background-color:' + label"
          @click="boardCoverColor(label)"
        >
          <span class="icon"></span>
        </li>
      </ul>
    </form>
    <div v-if="isPhotos">
      <h3>Unsplash</h3>
      <div class="side-menu-imgs">
        <button
          v-for="(cover, idx) in boardCovers"
          :key="idx"
          @click="boardCoverImage(cover)"
        >
          <img class="cover-img" :src="cover.imgUrl" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editCovers: [
        "#61bd4f",
        "#f2d600",
        "#ff9f1a",
        "#eb5a46",
        "#c377e0",
        "#0079bf",
        "#00c2e0",
        "#51e898",
        "#ff78cb",
        "#344563",
      ],
      pickedCover: {
        id: null,
        color: "#344563",
      },
      isRemoved: true,
      isModalOpen: true,
      isColors: false,
      isPhotos: false,
    };
  },
  computed: {
    boardCovers() {
      const board = this.$store.getters.selectedBoard;
      return board.covers;
    },
  },
  methods: {
    boardCoverImage(img) {
      this.$emit("boardCoverImage", img);
    },
    boardCoverColor(color) {
      this.pickedCover.color = color;
      this.$emit("boardCoverColor", this.pickedCover);
    },
    closeModal() {
      this.isModalOpen = false;
    },
    removeCover() {
      this.isRemoved = false;
      this.$emit("removeCover");
    },
    colorModal() {
      this.isColors = true;
      this.isPhotos = false;
    },
    photoModal() {
      this.isPhotos = true;
      this.isColors = false;
    },
    // backModal() {
    //   this.isPhotos = false;
    //   this.isColors = false;
    // },
  },
};
</script>
