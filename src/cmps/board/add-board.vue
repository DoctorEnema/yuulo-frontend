<template>
  <section>
    <div @click="toggleCreateBoard" class="add-board-container"></div>
    <div class="add-board">
      <div
        :style="{ backgroundImage: 'url(' + imgUrl + ')' }"
        class="create-board-header"
      >
        <input v-model="title" type="text" placeholder="Add board title" />
        <button @click="toggleCreateBoard"></button>
      </div>
      <div class="add-board-covers">
        <button
          v-for="cover in covers"
          :key="cover.id"
          @click="imgUrl = cover.imgUrl"
        >
          <img :src="cover.imgUrl" />
        </button>
      </div>

      <button
        class="create-board-btn"
        :class="{ 'disabled-btn': !title }"
        @click="createBoard"
      >
        Create board
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      imgUrl:
        "https://res.cloudinary.com/davidyan7/image/upload/v1625997002/samples/landscapes/beach-boat.jpg",
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
    };
  },
  computed: {
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
  },
  methods: {
    toggleCreateBoard() {
      this.$emit("toggleCreateBoard");
    },
    createBoard() {
      if (!this.title) return;
      this.$emit("createBoard", this.title, this.imgUrl);
      this.$emit("toggleCreateBoard");
    },
  },
};
</script>

<style>
</style>