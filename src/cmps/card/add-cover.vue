<template>
  <div class="add-to-card">
    <div class="create-cover" v-if="!isPhotoSearch">
      <div class="add-card-header">
        <button @click="closeModal"></button>
        <h3>Cover</h3>
      </div>
      <div class="cover-controls">
        <div class="big-cover-controls">
          <button>Header inside the cover</button>
          <button>Header outside the cover</button>
        </div>
        <button v-if="isRemoved" @click="removeCover">Remove Cover</button>
      </div>
      <form @submit.prevent="setCoverColor()">
        <!-- <label for="name">colors</label> -->
        <h3 class="unsplash-h3">Colors</h3>
        <ul class="cover-colors">
          <li
            class="card-cover-color"
            v-for="(label, idx) in editCovers"
            :key="idx"
            :style="'background-color:' + label"
            @click="setCoverColor(label)"
          >
            <span class="icon"></span>
          </li>
        </ul>
      </form>
      <h3 class="unsplash-h3">Attachments</h3>
      <img-upload-basic @saveImg="saveImg"></img-upload-basic>
      <h3 class="unsplash-h3">Unsplash</h3>
      <div class="cover-unsplash">
        <button
          v-for="(photo, idx) in photos.slice(0, 9)"
          :key="idx"
          @click="setCover(photo.urls.regular)"
        >
          <img class="cover-img" :src="photo.urls.regular" alt="" />
        </button>
      </div>
      <button class="unsplash-search-btn" @click="setIsSearch">
        Search for photos
      </button>
    </div>

    <div v-else class="photo-search">
      <div class="add-card-header-search">
        <!-- <button class="cover-back-btn" v-if="isPhotoSearch" @click="setIsSearch"></button> -->
        <span
          class="cover-back-btn"
          v-if="isPhotoSearch"
          @click="setIsSearch"
        ></span>
        <button class="exit-btn" @click="closeModal"></button>
        <h3>Cover</h3>
      </div>
      <form @input.prevent="onSearchPhotos">
        <input
          type="text"
          v-model="search.query"
          placeholder="Search Unsplash for photos"
        />
      </form>
      <div class="loader-svg" v-if="loading">
        <img src="../../assets/img/bars.svg" />
      </div>
      <div v-else>
      <h3 v-if="isSearched" class="unsplash-h3 add">Results</h3>
      <h3 v-else class="unsplash-h3 add">Top photos</h3>
        <div v-if="photos" class="cover-unsplash">
          <button
            v-for="(photo, idx) in photos.slice(0, 12)"
            :key="idx"
            @click="setCover(photo.urls.regular)"
          >
            <img class="cover-img" :src="photo.urls.regular" alt="" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imgUploadBasic from "./img-upload-basic.vue";

export default {
  components: {
    imgUploadBasic,
  },
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
    saveImg(link) {
      this.link = link;
      this.setLink();
    },
    setLink() {
      this.$emit("linkAdded", this.link);
    },
    setCover(imgUrl) {
      this.isRemoved = true;
      const cover = { imgUrl };
      this.$emit("setCover", cover);
    },
    setCoverColor(color) {
      this.isRemoved = true;
      this.pickedCover.color = color;
      this.$emit("setCover", this.pickedCover);
    },
    closeModal() {
      this.$emit("closeModal");
    },
    removeCover() {
      this.isRemoved = false;
      this.$emit("removeCover");
    },
    onSearchPhotos() {
      try {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null
        }
        this.loading = true;
        this.isSearched = true
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
    setIsSearch() {
      this.isPhotoSearch = !this.isPhotoSearch;
    },
  },
};
</script>
