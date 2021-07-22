
<template>
  <section class="activities">
    <div class="add-comment">
      <img :src="loggedinUser.imgUrl" />
      <textarea
        v-model="activity"
        @focus="isActive = true"
        placeholder="Write a Comment..."
      ></textarea>
    </div>
    <div v-if="this.isActive" class="activity-controls">
      <button @click.stop="setActivity">Save</button>
      <button @focus="isActive = false"></button>
    </div>
    <div v-for="activity in selectedBoard.activities" :key="activity.id">
      <section v-if="activity.card.id === card.id">
        <div class="activity">
          <div>
            <img
              v-if="activity.byMember.imgUrl"
              :src="activity.byMember.imgUrl"
            />
            <div v-else-if="activity.byMember.fullname" class="to-user activity-user">
              {{ activity.byMember.fullname.charAt(0) }}
            </div>
            <div v-else>?</div>
          </div>
          <span class="member-name">{{ activity.byMember.fullname }}</span>
          <span><span> </span> {{ activity.txt }}</span>
          <show-time class="activity-time" :time="activity.creatAt"></show-time>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import showTime from "./show-time.vue";

export default {
  components: {
    showTime,
  },
  data() {
    return {
      isActive: false,
      activity: "",
    };
  },
  computed: {
    selectedBoard() {
      return this.$store.getters.selectedBoard;
    },
    card() {
      return this.$store.getters.selectedCard;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  methods: {
    setActivity() {
      this.isActive = false;
      const newActivity = "commented: " + `'${this.activity}'`;
      this.$emit("setActivity", newActivity, this.activity);
      this.activity = "";
    },
  },
};
</script>

<style>
</style>