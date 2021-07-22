
<template>
  <section class="notifications">
    <section v-if="loggedinUser">
      <header class="add-card-header">
        <h4>Notifications</h4>
        <button class="close-notifications" @click="toggleNotifModal"></button>
      </header>
      <hr />
      <section class="yuumi-section" v-if="!loggedinUser.notifications.length">
        <div class="yuumi-sleep">
          <img src="../assets/img/yuumi-sleep.png" />
          <div class="cutter"></div>
          <h4>No notifications to show</h4>
        </div>
      </section>
      <section v-else class="activities">
        <button @click="clearNotifications">Clear</button>
        <div
          v-for="(notification, idx) in loggedinUser.notifications"
          :key="idx"
        >
          <div class="activity">
            <div>
              <img
                v-if="notification.byMember.imgUrl"
                :src="notification.byMember.imgUrl"
              />
              <!-- <div v-else class="to-user activity-user">
                {{ notification.byMember.fullname }}
              </div> -->
            </div>
            <span class="member-name">{{
              notification.byMember.fullname
            }}</span>
            <span><span> </span> {{ notification.txt }}</span>
            <show-time
              v-if="notification"
              class="activity-time"
              :time="notification.creatAt"
            ></show-time>
          </div>
        </div>
      </section>
    </section>
    <section v-else>Sign in to see notifications</section>
  </section>
</template>

<script>
import showTime from "./card/show-time.vue";

export default {
  components: {
    showTime,
  },
  props: {
    isNotifOpen: Boolean,
  },
  data() {
    return {
      isActive: false,
      activity: "",
    };
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    // user() {
    //   return this.$store.getters.user;
    // },
  },
  methods: {
    clearNotifications() {
      this.$emit("clearNotifications", this.loggedinUser._id);
    },
    toggleNotifModal() {
      this.$emit("toggleNotifModal");
    },
  },
};
</script>

<style>
</style>