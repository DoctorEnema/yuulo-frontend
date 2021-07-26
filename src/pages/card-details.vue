<template>
  <div @click="closeCard"  class="card-details-container">
        <div v-if="isPageLoading" class="loader-svg-global">
      <img src="../assets/img/yuumi-load.svg" />
    </div>
    <div  v-if="card">
    <section
      @drop.prevent="handleFile"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      v-if="!isEditCard"
      class="card-details clearfix"
      @click.stop="closeModal"
    >
    <div :class="{ 'details-drag': isDragOver }">
    </div>
      <div
        v-if="card.cover"
        class="details-cover"
        :style="{ backgroundColor: card.cover.color }"
      >
        <img v-if="card.cover.imgUrl" :src="card.cover.imgUrl" alt="" />
        <button
          class="choose-cover"
          data-cmp="add-cover"
          @click.stop="setModalType"
        >
          Cover
        </button>
      </div>
      <button
        :class="{ 'no-cover-details': !card.cover }"
        class="close-details"
        @click="closeCard"
      ></button>
      <header class="details-header">
        <span class="details-title"></span>
        <div>
          <!-- <h2>{{ card.title }}</h2> -->
          <form @submit.prevent="saveTitle">
            <p
              class="card-title"
              contenteditable
              ref="title"
              @keydown.13.prevent
              @keyup.13="saveTitle"
              @blur="saveTitle"
              @click="setTitleEdit"
              spellcheck="false"
              :class="titleEditMode"
            >
              {{ card.title }}
            </p>
          </form>
          <!--this is a textarea in trello -->
          <h5>in list {{ group.title }}</h5>
        </div>
      </header>
      <div class="details-body">
        <div v-if="card" class="left-side">
          <div class="details-top-left">
            <div v-if="isMembers" class="details-members">
              <h3>MEMBERS</h3>
              <member
                @setModalType="setModalType"
                :card="card"
                v-if="card.members"
                @removeMember="removeMember"
              ></member>
            </div>
            <div v-if="isLabels" class="details-labels">
              <h3>LABELS</h3>
              <labels
                :card="card"
                v-if="card.labelIds"
                @setModalType="setModalType"
              ></labels>
            </div>
            <div v-if="card.dueDate" class="details-dates">
              <h3>DUE DATE</h3>
              <date
                :card="card"
                v-if="card.dueDate"
                @changeComplete="changeComplete"
                @setModalType="setModalType"
              ></date>
            </div>
          </div>
          <div class="details-bottom-left">
            <div class="details-desc">
              <span class="details-desc-icon"></span>

              <description :card="card" @setDesc="setDesc"></description>
            </div>
            <div v-if="isAttachments" class="details-attachment">
              <h4>Attachments</h4>
              <span class="details-attachment-icon"></span>
              <attachment
                :card="card"
                v-if="card.attachments"
                @removeLink="removeLink"
                @setCover="setCover"
                @removeCover="removeCover"
                @setModalType="setModalType"
              ></attachment>
            </div>
            <div class="details-checklist">
              <ul v-if="card.checklists">
                <li v-for="(checklist, idx) in card.checklists" :key="idx">
                  <checklist
                    :checklist="checklist"
                    @addTodo="addTodo"
                    @removeList="removeList"
                  ></checklist>
                </li>
              </ul>
            </div>
            <div class="details-activity">
              <h4>Activity</h4>
              <span class="details-activity-icon"></span>
              <activities @setActivity="setActivity"></activities>
            </div>
          </div>
        </div>
        <div class="right-side">
          <h5>ADD TO CARD</h5>
          <button class="member-join" @click="joinMember" v-if="isMemberIn">
            Join
          </button>
          <button
            class="add-member"
            data-cmp="add-member"
            @click.stop="setModalType"
          >
            Members
          </button>
          <button
            class="add-label"
            data-cmp="add-label"
            @click.stop="setModalType"
          >
            Labels
          </button>
          <button
            class="add-checklist"
            data-cmp="add-checklist"
            @click.stop="setModalType"
          >
            Checklist
          </button>
          <button
            class="add-date"
            data-cmp="add-date"
            @click.stop="setModalType"
          >
            Dates
          </button>
          <button
            class="add-attachment"
            data-cmp="add-attachment"
            @click.stop="setModalType"
          >
            Attachment
          </button>
          <button
            v-if="!card.cover"
            class="add-cover"
            data-cmp="add-cover"
            @click.stop="setModalType"
          >
            Cover
          </button>
           <button
          class="delete-card-btn"
          @click.stop="removeCard(group, card.id)"
        >
          Delete card
        </button>
        </div>
      </div>
      <section
        class="modal add-to-card-modal"
        v-if="openModalType"
        @click.stop="stop"
      >
        <component
          :is="openModalType"
          @closeModal="closeModal"
          @addUser="addMember"
          @linkAdded="linkAdded"
          @addDate="addDate"
          @createLabel="createLabel"
          @setLabel="setLabel"
          @listAdded="addList"
          @setCover="setCover"
          @removeCover="removeCover"
          @search="setSearch"
          @removeDate="removeDate"
          :card="card"
          :labels="labelsToShow"
          :users="usersToShow"
        ></component>
      </section>
    </section>
    <div v-if="isEditCard" class="card-editor">
      <div
        class="right-side btns"
        :style="btnPosition"
        style="position: absolute"
      >
        <button
          class="add-member"
          data-cmp="add-member"
          @click.stop="setModalType"
        >
          Members
        </button>
        <button
          class="add-label"
          data-cmp="add-label"
          @click.stop="setModalType"
        >
          Labels
        </button>
        <button class="add-date" data-cmp="add-date" @click.stop="setModalType">
          Dates
        </button>

        <button
          class="add-cover"
          data-cmp="add-cover"
          @click.stop="setModalType"
        >
          Change cover
        </button>
        <button
          class="delete-card-btn"
          @click.stop="removeCard(group, card.id)"
        >
          Delete
        </button>
      </div>
      <section class="modal" v-if="openModalType" @click.stop="stop">
        <component
          :is="openModalType"
          @closeModal="closeModal"
          @addUser="addMember"
          @linkAdded="linkAdded"
          @addDate="addDate"
          @createLabel="createLabel"
          @setLabel="setLabel"
          @listAdded="addList"
          @setCover="setCover"
          @removeCover="removeCover"
          @search="setSearch"
          @removeDate="removeDate"
          :card="card"
          :labels="labelsToShow"
          :users="usersToShow"
        ></component>
      </section>
      <card-edit-preview
        :style="position"
        :group="group"
        :card="card"
      ></card-edit-preview>
    </div>
    </div>
  </div>
</template>

<script>
import cardEditPreview from "../cmps/card/card-edit-preview.vue";
import addLabel from "../cmps/card/add-label.vue";
import addChecklist from "../cmps/card/add-checklist.vue";
import addDate from "../cmps/card/add-date.vue";
import addMember from "../cmps/card/add-member.vue";
import addAttachment from "../cmps/card/add-attachment.vue";
import addCover from "../cmps/card/add-cover.vue";
import labels from "../cmps/card/label.vue";
import checklist from "../cmps/card/checklist.vue";
import date from "../cmps/card/date.vue";
import member from "../cmps/card/member.vue";
import attachment from "../cmps/card/attachment.vue";
import activities from "../cmps/card/activities.vue";
import description from "../cmps/card/description.vue";
import showTime from "../cmps/card/show-time.vue";
import { uploadImg } from "@/services/img-upload.service.js";
import { boardService } from "../services/board-service";
import { userService } from "../services/user-service";
import { utilService } from "../services/util-service";
import { socketService } from "../services/socket-service.js";

export default {
  components: {
    cardEditPreview,
    addLabel,
    addChecklist,
    addDate,
    addMember,
    addAttachment,
    addCover,
    labels,
    checklist,
    date,
    member,
    attachment,
    description,
    activities,
    showTime,
  },
  data() {
    return {
      openModalType: null,
      boardId: null,
      searchBy: "",
      searchType: "",
      isEditCard: null,
      isUpdated: false,
      isTitleEdit: false,
      isLoading: false,
      isDragOver: false,
      link: "",
    };
  },
  async created() {
    try {
      const { cardId, groupId, boardId, isEditCard } = this.$route.params;
      if (isEditCard === "true") this.isEditCard = true;
      else this.isEditCard = false;
      this.boardId = boardId;
      const card = await this.$store.dispatch({
        type: "loadCard",
        boardId,
        groupId,
        cardId,
      });
      window.document.title = `Yuulo - ${this.card.title}`;
      socketService.emit("card topic", cardId);
      // this.isUserAssignedToCard()
    } catch (err) {
      "cannot load card", err;
    }
    finally{
      this.$store.commit({type:'setLoading', isLoading: false})
    }
    // if (this.loggedinUser) this.$store.dispatch({ type: 'turnCardWatchOn'})
  },
  destroyed() {
    // this.$store.dispatch({
    //   type: "removeCurrent",
    //   group: null,
    //   card: null,
    // });
    this.$store.commit("removeCurrent");
    document.title = `Yuulo`;
  },
  computed: {
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
    card() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedCard));
    },
    group() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedGroup));
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isAttachments() {
      if (!this.card.attachments || !this.card.attachments.length) return false;
      return true;
    },
    isItEditCard() {
      return this.isEditCard && this.card;
    },
    isLabels() {
      if (!this.card.labelIds || !this.card.labelIds.length) return false;
      return true;
    },
    isCover() {
      if (!this.card.cover || !this.card.cover) return "transparent";
    },
    isMembers() {
      if (!this.card.members || !this.card.members.length) return false;
      return true;
    },
    isMemberIn() {
      if (!this.card.members) this.card.members = [];
      if (
        !this.card.members.some((m) => {
          m.id === this.loggedinUser.id;
        })
      )
        return !this.card.members.some((m) => m.id === this.loggedinUser.id);
    },
    labelsToShow() {
      return this.labelToShow();
    },
    usersToShow() {
      return this.userToShow();
    },
    users() {
      return this.$store.getters.users;
    },
    // user() {
    //   return this.$store.getters.user;
    // },
    showTime() {
      var actionLogged = this.act.at;
      var now = Date.now();
      var time = now - actionLogged;
      console.log(time);
      if (time < 60000) return " Just now";
      if (time < 3600000) return new Date(time).getMinutes() + " Minutes ago";
      if (time > 3600000 && time < 86400000)
        return new Date(time).getHours() + " Hours ago";
      else return "A while ago";
    },
    position() {
      const position = this.$store.getters.position;
      return `top: ${position.posY - 2}px; left: ${position.posX - 230}px`;
    },
    btnPosition() {
      const position = this.$store.getters.position;
      return `top: ${position.posY - 1}px; left: ${position.posX + 30.4}px`;
    },
    titleEditMode() {
      return { edit: this.isTitleEdit };
    },
    isPageLoading(){
      console.log(this.$store.getters.isLoading);
      return this.$store.getters.isLoading
    }
  },
  methods: {
    saveImg(link) {
      this.link = link;
      this.linkAdded(link);
    },
    handleFile(ev) {
      let file;
      if (ev.type === "change") file = ev.target.files[0];
      else if (ev.type === "drop") file = ev.dataTransfer.files[0];
      this.onUploadImg(file);
    },
    async onUploadImg(file) {
      this.isLoading = true;
      this.isDragOver = false;
      const res = await uploadImg(file);
      console.log("res", res.url);
      this.$emit("saveImg", res.url);
      this.isLoading = false;
      this.saveImg(res.url)
    },
    saveTitle(ev) {
      if (!this.$refs.title.innerText) return;
      if (this.isUpdated) return;
      console.log(ev);
      const card = this.card;
      card.title = this.$refs.title.innerText;
      this.isTitleEdit = false;
      this.updateCard();
      setTimeout(() => (this.isUpdated = false), 100);
      this.isUpdated = true;
      this.$refs.title.blur();
    },
    setTitleEdit() {
      this.isTitleEdit = true;
    },
    editCard() {
      this.isEditCard = true;
    },
    // isUserAssignedToCard() {
    //   // if(!this.loggedinUser) console.log('true');

    //   if (!this.loggedinUser) return
    //   // console.log('asdasd');
    //   if (!this.card?.members.length) return ('no members assigned to card')
    //   // console.log('asdasdasdasdsadasd');
    //   const isUserMember = this.card.members.some(member => member._id === this.loggedinUser._id)
    //   console.log('isUserMember',isUserMember);
    emitToUsers(fullActivity) {
      if (!this.card?.members.length) return;
      this.card.members.forEach((member) => {
        const data = { fullActivity, userId: member._id };
        if (this.loggedinUser._id !== member._id) {
          this.$store.dispatch({ type: "updateUserNotifications", data });
          socketService.emit("notifyMember", data);
        }
      });
    },
    stop() {
      // Dont Delete!!
      // no one knows what this does but it works
    },
    async updateCard() {
      try {
        const board = await this.$store.dispatch({
          type: "updateCard",
          board: this.selectedBoard,
          group: this.group,
          card: this.card,
        });
        return board;
      } catch (err) {
        console.log("cannot update card", err);
      }
    },
    async setComment(comment) {
      const fullComment = {
        byMember: this.loggedinUser,
        creatAt: Date.now(),
        id: utilService.makeId(),
        card: { id: this.card.id, title: this.card.title },
        txt: comment,
      };
      if (!this.card.comments) this.card.comments = [];
      this.card.comments.push(fullComment);
      await this.updateCard();
    },
    async setActivity(activity, comment) {
      const { _id, fullname, imgUrl } = this.loggedinUser;
      const fullActivity = {
        byMember: { _id, fullname, imgUrl },
        creatAt: Date.now(),
        id: utilService.makeId(),
        card: { id: this.card.id, title: this.card.title },
        groupId: this.group.id,
        boardId: this.selectedBoard._id,
        txt: activity,
        isRead: false,
      };
      console.log(this.card);
      this.setComment(comment);
      await this.$store.dispatch({
        type: "updateActivities",
        activity: fullActivity,
      });
      this.emitToUsers(fullActivity);
    },
    setDesc(desc) {
      this.card.description = desc;
      this.updateCard();
    },
    async setCover(cover) {
      this.card.cover = {};
      this.card.cover = cover;
      await this.setActivity(`added cover to ${this.card.title}`);
      this.updateCard();
    },
    async removeCover() {
      this.card.cover = null;
      await this.setActivity(`removed cover from ${this.card.title}`);
      this.updateCard();
    },
    setLabel(labelId) {
      console.log(this.loggedinUser);
      if (!this.card.labelIds) this.card.labelIds = [];
      if (this.card.labelIds.some((lId) => lId === labelId)) {
        this.removeLabel(labelId);
        return;
      }
      if (labelId === null) return;
      this.card.labelIds.push(labelId);
      this.updateCard();
    },
    removeLabel(labelId) {
      const labelIdx = this.card.labelIds.findIndex(
        (label) => label === labelId
      );
      this.card.labelIds.splice(labelIdx, 1);
      this.updateCard();
    },
    async createLabel(pickedLabel, action = "add") {
      await this.$store.dispatch({
        type: "updateLabel",
        boardId: this.boardId,
        pickedLabel: { ...pickedLabel },
        action,
      });
      if (action === "add") {
        this.setLabel(pickedLabel.id);
      }
    },
    changeComplete(isComplete) {
      this.card.dueDate.isComplete = isComplete;
      this.updateCard();
    },
    async addDate(date) {
      if (!this.card.dueDate) this.card.dueDate = {};
      this.card.dueDate.date = date;
      if (!this.card.dueDate.isComplete) this.card.dueDate.isComplete = false;
      await this.setActivity(`added date to ${this.card.title}`);
      this.updateCard();
    },
    async removeDate() {
      this.card.dueDate = null;
      await this.setActivity(`removed date from ${this.card.title}`);
      this.updateCard();
    },
    async linkAdded(link) {
      const newLink = {
        name: "Image",
        imgUrl: link,
        comment: "",
        time: Date.now(),
      };
      if (!this.card.attachments) this.card.attachments = [];
      this.card.attachments.push(newLink);
      await this.setActivity(
        `added an attachment to ${this.card.title}`
      );
      this.updateCard();
    },
    async removeLink(idx, attachment) {
      this.card.attachments.splice(idx, 1);
      await this.setActivity(
        `removed an attachment: ${attachment.name} from ${this.card.title}`
      );
      this.updateCard();
    },
    joinMember() {
      // When signup will be in MONGO NEED TO FIX THE ID
      if (!this.card.members) this.card.members = [];
      if (!this.card.members.some((m) => m._id === this.loggedinUser.id)) {
        this.addMember(this.loggedinUser);
        return;
      }
    },
    async addMember(member) {
      if (!this.card.members) this.card.members = [];
      if (this.card.members.some((m) => m._id === member._id)) {
        this.removeMember(member);
        return;
      }
      if (!this.selectedBoard.members.some((m) => m._id === member._id)) return;
      this.card.members.push(member);
      await this.setActivity(`added ${member.fullname} to ${this.card.title}`);
      await this.updateCard();
    },
    async removeMember(member) {
      const memberIdx = this.card.members.findIndex(
        (mem) => mem._id === member._id
      );
      this.card.members.splice(memberIdx, 1);
      await this.setActivity(
        `removed ${member.fullname} from ${this.card.title}`
      );
      await this.updateCard();
    },
    addTodo(checklist) {
      const checklistIdx = this.card.checklists.findIndex(
        (c) => c.id === checklist.id
      );
      this.card.checklists.splice(checklistIdx, 1, checklist);
      this.updateCard();
    },
    async addList(title) {
      if (!this.card.checklists) this.card.checklists = [];
      var newList = boardService.getEmptyList();
      newList.title = title;
      this.card.checklists.push(newList);
      await this.setActivity(`added a checklist to ${this.card.title}`);
      this.updateCard();
    },
    async removeList(listId) {
      const listIdx = this.card.checklists.findIndex(
        (list) => list._id === listId
      );
      this.card.checklists.splice(listIdx, 1);
      await this.setActivity(`remove a checklist from ${this.card.title}`);
      this.updateCard();
    },
    closeModal() {
      if (!this.openModalType) return;
      this.openModalType = null;
    },
    setModalType(ev) {
      var value = ev.target.dataset.cmp;
      this.openModalType = value;
    },
    closeCard() {
      this.$router.push(`/board/${this.selectedBoard._id}`);
    },
    setSearch(search) {
      this.searchBy = search.searchBy;
      this.searchType = search.type;
    },
    async removeCard() {
      try {
        const boardId = await this.$store.dispatch({
          type: "removeCard",
          board: this.selectedBoard,
          group: this.group,
          cardId: this.card.id,
        });
        this.$router.push(`/board/${boardId}`);
      } catch (err) {
        console.log("cannot remove card");
      }
    },
    labelToShow() {
      if (!this.searchBy) return this.selectedBoard.labels;
      if (this.searchType !== "label") return this.selectedBoard.labels;
      if (this.searchBy) {
        const searchStr = this.searchBy.toLowerCase();
        const labelToShow = this.selectedBoard.labels.filter((lable) => {
          return lable.name?.toLowerCase().includes(searchStr);
        });
        return labelToShow;
      }
    },
    userToShow() {
      if (!this.searchBy) return this.users;
      if (this.searchType !== "user") return this.users;
      if (this.searchBy) {
        const searchStr = this.searchBy.toLowerCase();
        const userToShow = this.users.filter((user) => {
          return user.fullname?.toLowerCase().includes(searchStr);
        });
        return userToShow;
      }
    },
  },
};
</script>
