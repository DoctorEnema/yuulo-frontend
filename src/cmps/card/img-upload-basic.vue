<template>
  <section >
    <button @click="uploadImage"></button>
      <input @change="onUploadImg" type="file" id="imgUpload"  style="display:none;"/>
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
    uploadImage() {
      const elInput = document.querySelector('#imgUpload').click()
      console.log(elInput);
      
    }
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