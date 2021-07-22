<template>
  <section >
      <input @change="onUploadImg" type="file" id="imgUpload"  />
  </section>
</template>

<script>
import { uploadImg } from "@/services/img-upload.service.js";
export default {
  data() {
    return {
    };
  },
  methods: {
    async onUploadImg(ev) {
      this.isLoading = true
      const res = await uploadImg(ev);
      this.$emit('saveImg', res.url)
      this.isLoading = false
    },
  },
};
</script>

<style>
img.upload {
  height: 200px;
  cursor: pointer;
}
img.loading {
  height: 200px;
}


</style>