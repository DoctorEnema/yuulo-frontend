
<template>
  <section class="notifications">
    <section v-if="loggedinUser">
      <header class="add-card-header">
        <h4>Notifications</h4>
        <button class="close-notifications" @click="toggleNotifModal"></button>
      </header>
      <hr />
      <section  class="yuumi-section" v-if="!loggedinUser.notifications.length">
        <div @click="clickedYuumi" class="yuumi-sleep">
          <img v-if="isYuumiClicked" src="../assets/img/yuumi-sleep.png" />
          <img v-else src="../assets/img/yuumi-wake.png" />
        </div>
          <h4>No notifications to show</h4>
      </section>
      <section v-else class="activities">
        <div class="notif-btns">
          <!-- <button>Show only unread</button> -->
          <button @click="clearNotifications">Clear all notifications</button>
        </div>
        <div class="notif-content">
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
                <div class="to-user" v-else-if="notification.byMember.fullname">
                  {{ notification.byMember.fullname.charAt(0) }}
                </div>
                <div v-else>?</div>
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
      isYuumiClicked: true,
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
    clickedYuumi(){
      this.isYuumiClicked = !this.isYuumiClicked
    }
  },
};
</script>

<style>
</style>