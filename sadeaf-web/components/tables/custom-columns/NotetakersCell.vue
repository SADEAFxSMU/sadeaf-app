<template>
  <div>
    <div class="cell">
      <div v-for="notetaker in notetakers"
           class="notetaker">
        <user-card-horizontal-small :user="notetaker" />
        <button class="el-icon-close delete-button"
                @click.prevent="onDeleteNotetaker(notetaker)"
                v-if="editable" />
      </div>
    </div>
    <div v-if="editable">
      <user-search @select="onAddNotetaker" />
    </div>
  </div>
</template>

<script>
import UserCardHorizontalSmall from "../../user/UserCardHorizontalSmall";
import UserSearch from "../../user/UserSearch";
export default {
  name: "NotetakersCell",
  components: {UserSearch, UserCardHorizontalSmall},
  props: {
    row: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
      default: false,
    }
  },

  data() {
    return {
      toDelete: [],
    }
  },

  computed: {
    notetakers() {
      return this.row.notetakers;
    },
  },

  methods: {
    onDeleteNotetaker(notetaker) {
      this.$emit('update', {
        notetakers: this.row.notetakers.filter(nt => nt.id !== notetaker.id)
      });
    },
    onAddNotetaker(notetaker) {
      if (this.row.notetakers.find(nt => nt.id === notetaker.id)) {
        return;
      }
      this.$emit('update', {
        notetakers: [...this.row.notetakers, notetaker]
      })
    }
  }
};
</script>

<style scoped>
.cell {
  padding: 0;
}

.cell > :last-child {
  margin-right: 0;
}

.notetaker {
  display: flex;
  align-items: center;
  width: 100%;
}

.delete-button {
  transition: background 0.2s;
  padding: 3px;
  border-radius: 50px;
  background: lightgrey;
  color: white;
  border: none;
  outline: none;
}
.delete-button:hover {
  background: salmon;
  cursor: pointer;
}
</style>
