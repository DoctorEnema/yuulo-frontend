<template>
  <VueDatePicker
    v-model="date"
    inline
    @input="addDate"
  />
</template>
<script>
export default {
  data: () => ({
    date: new Date(),
  }),
  methods:{
      addDate(){
          console.log(this.date);
      }
  }
};
</script>