<template>
  <section class="add-to-card">
    <section class="add-member">
      <header class="add-card-header">
        <h3>Members</h3>
        <button @click="closeModal"></button>
      </header>
      <hr />
      <input
        v-model="searchBy"
        ref="searchInput"
        type="text"
        @input="search"
        placeholder="Search members"
      />
      <ul>
        <h5>BOARD MEMBERS</h5>
        <li
          class="user-member"
          v-for="user in selectedBoard.members"
          :key="user._id"
        >
          <button @click="addUser(user)">
            <img v-if="user.imgUrl" :src="user.imgUrl" />
            <div v-else-if="user.fullname" class="to-user">
              {{ user.fullname.charAt(0) }}
            </div>
            <div class="to-user" v-else>?</div>
            {{ user.fullname }}
            <span v-if="isMemberPicked(user)" class="icon"> ✔</span>
          </button>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      searchBy: "",
    };
  },
  props: {
    card: Object,
    // users: Array,
  },
  created() {
    this.$store.dispatch({ type: "loadUsers" });
  },
  mounted() {
    this.$refs.searchInput.focus();
  },
  methods: {
    closeModal() {
      this.searchBy = "";
      this.search();
      this.$emit("closeModal");
    },
    addUser(user) {
      this.$emit("addUser", user);
    },
    isMemberPicked(member) {
      if (!this.card.members) return;
      return this.card.members.some((m) => m._id === member._id);
    },
    search() {
      this.$emit("search", { type: "user", searchBy: this.searchBy });
    },
  },
  computed: {
    // users() {
    //   return this.$store.getters.users;
    // },
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
  },
};
</script>

<style>
</style>