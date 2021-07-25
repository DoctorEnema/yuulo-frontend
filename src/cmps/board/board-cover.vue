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
    <div class="side-menu-unsplash" v-if="isPhotos">
      <!-- <h3 v-if="isSearched" class="unsplash-h3 add">Results</h3> -->
      <h3 class="unsplash-h3 add">Unsplash</h3>
      <form @input.prevent="onSearchPhotos">
        <input
          type="text"
          v-model="search.query"
          placeholder="Search Unsplash for photos"
        />
      </form>
      <div class="loader-svg" v-if="loading">
        <img src="../../assets/img/yuumi-load.svg" />
      </div>
      <div v-else>
        <div v-if="photos" class="side-menu-imgs">
          <button
            v-for="(photo, idx) in photos"
            :key="idx"
            @click="boardCoverImage(photo.urls.regular)"
          >
            <img class="cover-img" :src="photo.urls.thumb" alt="" />
          </button>
        </div>
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
      link: "",
      isPhotoSearch: false,
      search: { query: null },
      timeoutId: null,
      loading: false,
      isSearched: false,
    };
  },
  computed: {
    boardCovers() {
      const board = this.$store.getters.selectedBoard;
      return board.covers;
    },
    photos() {
      return this.$store.getters.photos;
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
    //   onSearchPhotos() {
    //   const searchTerm = {...this.search};
    //   this.$store.dispatch({ type: "getUnsplash", query: searchTerm.query });
    //   this.search.query = null
    // },
    setSearch() {
      this.isPhotoSearch = !this.isPhotoSearch;
    },

    onSearchPhotos() {
      try {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        this.loading = true;
        this.isSearched = true;
        this.timeoutId = setTimeout(() => {
          const searchTerm = { ...this.search };
          if (!searchTerm.query) searchTerm.query = "new york";
          this.$store
            .dispatch({ type: "getUnsplash", query: searchTerm.query })
            .then(() => (this.loading = false));
        }, 1400);
        // this.search.query = null
      } catch (err) {
        console.log("cannot execute search", err);
      }
    },
    // backModal() {
    //   this.isPhotos = false;
    //   this.isColors = false;
    // },
  },
};
</script>
