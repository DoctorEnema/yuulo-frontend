<template>
  <section ref="page" tabindex="0" class="add-to-card">
    <section class="add-label">
      <button class="labels-back" v-if="isCreate" @click="onClickBack"></button>
      <header class="add-card-header">
        <span class="add-label-title">Labels</span>
        <button @click="closeModal"></button>
      </header>
      <hr />
      <input
        v-model="searchBy"
        ref="searchInput"
        type="text"
        @input="search"
        placeholder="Search labels..."
      />
      <div v-if="!isCreate" class="choose-label">
        <h5>LABELS</h5>
        <div class="label-picker">
          <div
            class="card-label"
            v-for="(label, idx) in labels"
            :key="idx"
            :style="{ 'background-color': label.color, 'box-shadow': '-8px 0 '+label.color + '90' }"
            @click="setLabel(label.id)"
          >
            <div class="label-colors">
              <div class="label-name">{{ label.name }}</div>
              <div v-if="isLabelPicked(label)" class="icon">✔</div>
            </div>
            <a href="#" @click.stop="editLabel(label)"></a>
          </div>
        </div>
      </div>
      <button class="create-label-btn" @click.stop="createLabel" type="button">
        Create new label
      </button>
      <div v-if="isCreate" class="create-label">
        <form @submit.prevent="createLabel()">
          <div v-if="!isEdit">
            <label for="name">Name</label>
            <input
              id="name"
              ref="name"
              type="text"
              v-model="pickedLabel.name"
            />
          </div>
          <div v-else>
            <label for="name"></label>
            <input
              id="name"
              ref="nameEdit"
              type="text"
              v-model="labelToEdit.name"
            />
          </div>
          <ul>
            <li
              class="card-label-color"
              v-for="(label, idx) in editLabels"
              :key="idx"
              :style="'background-color:' + label"
              @click="setChosenLabel(label)"
            >
              <span v-if="pickEditedLabel(label)" class="icon">✔</span>
            </li>
          </ul>
          <div class="add-label-btns" v-if="isEdit">
            <button @click.prevent="saveEditedLabel">Save</button>
            <button @click.prevent="removeLabel">Delete</button>
          </div>
          <div v-else>
            <button class="create-new-label">Create</button>
          </div>
        </form>
      </div>
    </section>
  </section>
</template>

<script>
import { utilService } from "../../services/util-service";
export default {
  components: {
    utilService,
  },
  props: {
    card: Object,
    labels: Array,
  },
  created() {},
  mounted() {
    //  this.$refs.page.focus();
    this.$refs.searchInput.focus();
  },
  data() {
    return {
      editLabels: [
        "#61bd4f",
        "#f2d600",
        "#ff9f1a",
        "#eb5a46",
        "#c377e0",
        "#0079bf",
        "#00c2e0",
        "#51e898",
        "#ff78cb",
        "#344563",
      ],
      isCreate: false,
      isEdit: false,
      pickedLabel: {
        id: null,
        name: null,
        color: "#344563",
        isPicked: true,
      },
      labelToEdit: null,
      searchBy: "",
    };
  },
  computed: {
    selectedBoard() {
      return JSON.parse(JSON.stringify(this.$store.getters.selectedBoard));
    },
    // isLabelPicked(label) {
    // return pickedLabels = this.card.labelIds.filter(id=> id === selectedBoard.labels.id)
    // console.log('this.card.labelIds', this.card.labelIds);
    // console.log('this.selectedBoard.labels',this.selectedBoard.labels);
    // const pickedLabels = this.card.labelIds.some(id=> id === this.selectedBoard.labels.forEach(label => id === label.id))
    // const pickedLabels = this.selectedBoard.labels.forEach(label=> this.card.labelIds.some(id => id === label.id))
    // console.log(pickedLabels);
    // return pickedLabels
    // console.log(label.id);
    //   return
    // },
  },
  methods: {
    isLabelPicked(label) {
      if (!this.card.labelIds) return;
      // if (this.isEdit){
      return this.card.labelIds.some((id) => id === label.id);
    },
    pickEditedLabel(color) {
      // if (!this.labelToEdit) return
      if (this.isEdit) {
        if (color === this.labelToEdit.color) return true;
      } else {
        return color === this.pickedLabel.color;
      }
      // else return false
    },
    closeModal() {
      this.searchBy = "";
      this.search();
      this.$emit("closeModal");
    },
    setLabel(label) {
      this.$emit("setLabel", label);
    },

    createLabel() {
      if (this.isCreate) {
        this.pickedLabel.id = utilService.makeId();
        const pickedLabelCopy = JSON.parse(JSON.stringify(this.pickedLabel));
        this.$emit("createLabel", pickedLabelCopy);
        this.setPickedLabelEmpty();

        //  this.setLabel(this.pickedLabel.id)
        // this.labels.push({...this.pickedLabel});
        // return
      }
      this.isCreate = !this.isCreate;
      if (!this.isCreate) return;
      this.$nextTick(() => {
        this.$refs.name.focus();
      });
    },
    editLabel(label) {
      this.isCreate = !this.isCreate;
      this.isEdit = !this.isEdit;
      this.labelToEdit = label;
      this.$nextTick(() => {
        this.$refs.nameEdit.focus();
        this.$refs.nameEdit.select();
      });
    },

    removeLabel() {
      this.$emit("createLabel", this.labelToEdit, "remove");
      this.isCreate = false;
      this.isEdit = false;
      // this.$nextTick(() => {
      //   this.$refs.name.focus();
      // });
    },
    saveEditedLabel() {
      this.$emit("createLabel", this.labelToEdit, "update");
      this.isCreate = false;
      this.isEdit = false;
      // this.$nextTick(() => {
      //   this.$refs.name.focus();
      // });
    },
    setPickedLabelEmpty() {
      this.pickedLabel = {
        id: null,
        name: null,
        color: "#344563",
        isPicked: true,
      };
    },
    onClickBack() {
      this.isCreate = false;
      this.isEdit = false;
    },
    setChosenLabel(color) {
      this.isEdit
        ? (this.labelToEdit.color = color)
        : (this.pickedLabel.color = color);
    },
    search() {
      this.$emit("search", { type: "label", searchBy: this.searchBy });
    },
  },
};
</script>
