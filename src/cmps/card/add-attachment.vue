<template>
  <section class="add-to-card">
    <header class="add-card-header">
      <span class="add-label-title">Add attachment</span>
      <button @click="closeModal"></button>
    </header>
    <hr />
    <form class="add-attachments" @submit.prevent="setLink(), closeModal()">
      <!-- <label for="attachment">Attach a link</label> -->
      <h3>Attach a link</h3>
      <image-upload @saveImg="saveImg"></image-upload>
      <input ref="attach" v-model="link" type="text" placeholder="Paste any link here..." />
      <button>Attach</button>
    </form>
  </section>
</template>

<script>
import imageUpload from "./img-upload.vue";
export default {
  components:{
    imageUpload
  },
  mounted() {
    this.$refs.attach.focus();
  },
  data() {
    return {
      link: ''
    };
  },
  methods: {
    resetModals() {
      this.$emit("closeModals");
    },
    saveImg(link){
      this.link=link
    },
    setLink() {
      // console.log(this.link);
      this.$emit('linkAdded', this.link)
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style>
</style>