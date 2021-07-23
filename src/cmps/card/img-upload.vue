<template>
  <div class="img-upload-container">
    <h3>or drop an image here</h3>

    <template v-if="!isLoading">

      <!-- UPLOAD IMG -->
      <label
        for="imgUploader"
        @drop.prevent="handleFile"
        @dragover.prevent="isDragOver = true"
        @dragleave="isDragOver = false"
        :class="{ drag: isDragOver }"
      >
        <img class="upload-img"
          v-if="!isDragOver"
      src="../../assets/img/yuumi-sleep.png"
          alt=""
        />

        <h3 v-else>Drop image here</h3>
      </label>
      
      <!-- HIDDEN INPUT -->
      <input
        type="file"
        name="img-uploader"
        id="imgUploader"
        @change="handleFile"
      />
    </template>


    <!-- LOADER -->
    <img
      class="loader"
      v-else
      src="../../assets/img/yuumi-wake.png"
      alt=""
    />
  </div>
</template>

<script>
import { uploadImg } from "@/services/img-upload.service.js";
export default {
  data() {
    return {
      isLoading: false,
      isDragOver: false,
    };
  },
  methods: {
    // dragOver(ev) {
    //   this.isDragOver = true;
    // },
    handleFile(ev) {
      let file;
      if (ev.type === "change") file = ev.target.files[0];
      else if (ev.type === "drop") file = ev.dataTransfer.files[0];
      this.onUploadImg(file);
      console.log("file", file)
    },

    async onUploadImg(file) {
      this.isLoading = true;
      this.isDragOver = false;
      const res = await uploadImg(file);
      console.log("res", res.url)
      this.$emit("saveImg", res.url);
      this.isLoading = false;
    },
  },
};
</script>

