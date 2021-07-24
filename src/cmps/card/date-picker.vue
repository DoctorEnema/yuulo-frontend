<template>
  <VueDatePicker
    v-model="date"
    inline
     :locale="locale"
    @input="addDate"
  />
</template>
<script>
export default {
  data: () => ({
    date: new Date(),
      locale: { lang: 'en'}
  }),
  methods:{
      addDate(){
          console.log(this.date);
      }
  }
};
</script>