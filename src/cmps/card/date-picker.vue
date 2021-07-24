<template>
  <VueDatePicker
    v-model="date"
    inline
     :locale="locale"
    @input="setDate"
  />
</template>
<script>
export default {
  data: () => ({
    date: new Date(),
      locale: { lang: 'en'}
  }),
  created(){
//   this.$emit('setDate',this.date)
  },
  methods:{
      setDate(){
          this.$emit('setDate',this.date);
      }
  }
};
</script>