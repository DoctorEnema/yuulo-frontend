<template>
  <section>
    <div
      class="attachment"
      v-for="(attachment, idx) in card.attachments"
      :key="attachment.id"
    >
      <img :src="attachment.imgUrl" />
      <div class="attachment-info">
        <h3>{{ attachment.name }}</h3>
        <div class="attachment-controls">
          <p>Added</p>
          <span></span><show-time :time="attachment.time"></show-time>
          <span>-</span>
          <a href="#">Comment</a>
          <span>-</span>
          <a href="#" @click="removeAttachment(idx, attachment)">Delete</a>
          <span>-</span>
          <a href="#">Edit</a>
        </div>
        <div class="make-cover-attachment">
          <span></span>
          <a
            href="#"
            v-if="!isCovered(attachment.imgUrl)"
            @click="setCover(attachment.imgUrl)"
            >Make cover</a
          >
          <a href="#" v-else @click="removeCover">Remove cover</a>
        </div>
      </div>
    </div>
    <button class="control-btn add-attachment-btn" data-cmp="add-attachment" @click.stop="setModalType">Add an attachment</button>
  </section>
</template>

<script>
import showTime from "../../cmps/card/show-time.vue";
import { utilService } from "../../services/util-service";
export default {
  props: {
    card: Object,
  },
  components: {
    showTime,
  },
  data() {
    return {
      isRemoved: true,
    };
  },
  computed: {},
  methods: {
    isCovered(imgUrl) {
      return this.card.cover?.imgUrl === imgUrl;
    },
    removeAttachment(idx, attachment) {
      this.$emit("removeLink", idx, attachment);
    },
    setCover(cover) {
      const newCover = { id: utilService.makeId(), imgUrl: cover };
      this.$emit("setCover", newCover);
    },
    removeCover() {
      this.$emit("removeCover");
    },
    setModalType(ev) {
      this.$emit("setModalType", ev);
    },
  },
};
</script>

<style>
</style>