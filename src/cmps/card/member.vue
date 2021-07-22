<template>
  <section class="member" v-if="card.members">
    <div class="members" v-for="member in card.members" :key="member.id">
      <button @click="removeMember(member)">
        <img v-if="member.imgUrl" :src="member.imgUrl" />
        <div v-else-if="member.fullname" class="to-user member-user">
          {{ member.fullname.charAt(0) }}
        </div>
        <div v-else>?</div>
      </button>
    </div>
    <button
      data-cmp="add-member"
      @click.stop="setModalType"
      class="add-new-member"
    ></button>
  </section>
</template>

<script>
export default {
  props: {
    card: Object,
  },
  created() {},
  data() {
    return {};
  },
  methods: {
    removeMember(member) {
      this.$emit("removeMember", member);
    },
    setModalType(ev) {
      this.$emit("setModalType", ev);
    },
  },
  computed: {},
};
</script>

