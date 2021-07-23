<template>
  <section class="add-to-card add-attachments">
    <header class="add-card-header">
      <h3>Add attachment</h3>
      <button @click="closeModal"></button>
    </header>
    <hr />
    <form @submit.prevent="setLink(), closeModal()">
      <!-- <label for="attachment">Attach a link</label> -->
      <input
        ref="attach"
        v-model="link"
        type="text"
        placeholder="Paste any link here..."
      />
      <image-upload @saveImg="saveImg"></image-upload>
      <button>Attach</button>
    </form>
  </section>
</template>

<script>
import imageUpload from "./img-upload.vue";
export default {
  components: {
    imageUpload,
  },
  mounted() {
    this.$refs.attach.focus();
  },
  data() {
    return {
      link: "",
    };
  },
  methods: {
    resetModals() {
      this.$emit("closeModals");
    },
    saveImg(link) {
      this.link = link;
      this.setLink();
    },
    setLink() {
      // console.log(this.link);
      this.$emit("linkAdded", this.link);
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style>
</style>