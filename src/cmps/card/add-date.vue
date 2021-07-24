<template>
  <section class="add-to-card add-date">
    <div class="add-card-header">
      <button @click="closeModal"></button>
      <h3>Dates</h3>
    </div>
    <hr class="date-hr" />
    <button
      class="remove-date"
      v-if="card.dueDate"
      @click="
        removeDate();
        closeModal();
      "
    >
      Remove Date
    </button>
    <date-picker @setDate="setDate"></date-picker>
    <time-picker @setTime="setTime"></time-picker>
    <button @click="addDate">Ok</button>
      <!-- <el-date-picker
        @change="
          addDate();
          closeModal();
        "
        ref="dateInput"
        v-model="date"
        type="datetime"
        placeholder="Select date and time"
        value-format="timestamp"
        default-time="12:00:00"
      >
      </el-date-picker> -->
  </section>
</template>

<script>
import datePicker from "../../cmps/card/date-picker.vue";
import timePicker from "../../cmps/card/time-picker.vue";
export default {
  components:{
    datePicker,
    timePicker
  },
  props: {
    card: Object,
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "Today",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "Yesterday",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "A week ago",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      date: null,
      time:"T12:00:00"
    };
  },

  mounted() {
    // this.$refs.dateInput.focus();
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    setTime(time){
      this.time=time
    // console.log("time", time)

    },
    setDate(date){
      console.log("date", date)
      this.date = date
    // console.log("date", date)
    },
    addDate() {
      if(!this.date) {
        this.$emit("addDate", (Date.now()+24*60*60*1000))
        return
        }
      const newTime= this.date+this.time
      const time = Date.parse(newTime)
      this.$emit("addDate", time);
      this.closeModal()
    },
    removeDate() {
      this.$emit("removeDate");
    },
  },
};
</script>
      