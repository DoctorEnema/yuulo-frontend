<template>
  <div class="add-to-card">
    <div class="create-cover">
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
          v-for="(cover, idx) in boardCovers"
          :key="idx"
          @click="setCover(cover)"
        >
          <img class="cover-img" :src="cover.imgUrl" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import imgUploadBasic from "./img-upload-basic.vue";

export default {
  components:{
  imgUploadBasic
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
      link: ''
    };
  },
  computed: {
    boardCovers() {
      const board = this.$store.getters.selectedBoard;
      return board.covers;
    },
  },
  methods: {
     saveImg(link){
      this.link=link
      this.setLink()
    },
    setLink() {
      this.$emit('linkAdded', this.link)
    },
    setCover(cover) {
      this.isRemoved = true;
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
  },
};
</script>
