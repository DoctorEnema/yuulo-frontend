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
    <!-- <date-picker></date-picker> -->
      <el-date-picker
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
      </el-date-picker>
  </section>
</template>

<script>
import datePicker from "../../cmps/card/date-picker.vue";
export default {
  components:{
    datePicker
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
      date: "",
    };
  },

  mounted() {
    this.$refs.dateInput.focus();
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    addDate() {
      this.$emit("addDate", this.date);
    },
    removeDate() {
      this.$emit("removeDate");
    },
  },
};
</script>
      