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
        <h3>Colors</h3>
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
      <h3>Attachments</h3>
      <img-upload-basic @saveImg="saveImg"></img-upload-basic>
      <h3>Unsplash</h3>
      <div class="cover-unsplash">
        <button
          v-for="(photo, idx) in photos"
          :key="idx"
          @click="setCover(photo.urls.regular)"
        >
          <img class="cover-img" :src="photo.urls.regular" alt="" />
        </button>
      </div>
      <button @click="setSearch">Search for photos</button>
    </div>

    <div v-else class="photo-search">
      <form @submit.prevent="onSearchPhotos">
        <input
          type="text"
          v-model="search.query"
          placeholder="Search Unsplash for photos"
        />
        <!-- {{query}} -->
        <button>Search</button>
      </form>
      <h3>Unsplash</h3>
      <div v-if="photos" class="cover-unsplash">
        <button
          v-for="(photo, idx) in photos"
          :key="idx"
          @click="setCover(photo.urls.regular)"
        >
          <img class="cover-img" :src="photo.urls.regular" alt="" />
          <!-- {{photo.urls.regular}} -->
        </button>
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
      search: {query: ''},
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

      const cover = {imgUrl}
      console.log(cover);
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
      console.log("happening");
      const searchTerm = {...this.search};
      // console.log(query, 'aadd');

      this.$store.dispatch({ type: "getUnsplash", query: searchTerm.query });
    },
    setSearch() {
      this.isPhotoSearch = !this.isPhotoSearch;
    },
  },
};
</script>
