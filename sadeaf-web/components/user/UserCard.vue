<template>
  <div :class="classes" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave" @click="handleClick">
    <user-profile-link :link="linkToPage && getUserProfilePagePath(role, roleId)">
      <div :style="cardStyle" class="body-wrapper">
        <slot name="avatar">
          <div>
            <img v-if="profile_pic_url" :src="profile_pic_url" class="image" />
            <el-avatar v-else class="el-icon-user-solid" size="large" />
          </div>
        </slot>
        <slot name="body">
          <div class="body">
            <div class="deets">
              <h3 class="name">{{ name }}</h3>
              <role-tag :role="role" />
            </div>
            <div class="deets">
              <NotetakerRequiredTag
                style="margin-right: 8px"
                v-if="user.notetaker"
                label="Notetaker"
                size="mini"
              />
              <InterpreterRequiredTag
                style="margin-right: 8px"
                v-if="user.interpreter"
                label="Interpreter"
                size="mini"
              />
            </div>
            <div>
              {{ email }}
            </div>
          </div>
        </slot>
      </div>
      <div class="footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </user-profile-link>
  </div>
</template>

<script>
import UserProfileLink from '../link/UserProfileLink';
import { ROLE_EL_TAG_TYPES } from '../../common/types/constants';
import RoleTag from '../RoleTag';
import { getUserProfilePagePath } from '../../common/types/users';
import NotetakerRequiredTag from '@/components/tags/NotetakerRequiredTag';
import InterpreterRequiredTag from '@/components/tags/InterpreterRequiredTag';

export default {
  name: 'UserCard',

  components: {
    InterpreterRequiredTag,
    NotetakerRequiredTag,
    UserProfileLink,
    RoleTag,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
    roleId: {
      type: Number,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    linkToPage: {
      type: Boolean,
      required: false,
      default: true,
    },
    clickable: {
      type: Boolean,
      required: false,
      default: true,
    },
    cardStyle: {
      type: [String, Object],
      required: false,
    },
    imgStyle: {
      type: [String, Object],
      required: false,
    },
  },

  data() {
    return {
      isMouseOver: false,
    };
  },

  methods: {
    getUserProfilePagePath,

    handleMouseOver() {
      if (this.clickable || this.linkToPage) {
        this.isMouseOver = true;
      }
    },
    handleMouseLeave() {
      if (this.clickable || this.linkToPage) {
        this.isMouseOver = false;
      }
    },
    handleClick() {
      this.$emit('click', this.user);
    },
  },

  computed: {
    id() {
      return this.user.id;
    },
    name() {
      return this.user.name;
    },
    role() {
      const user = this.user;
      return (user.role) || 'USER';
    },
    email() {
      return this.user.email;
    },
    profile_pic_url() {
      return this.user.profile_pic_url;
    },
    classes() {
      return {
        card: true,
        hover: this.isMouseOver,
      };
    },
    elTagType() {
      return ROLE_EL_TAG_TYPES[this.role] || 'primary';
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 6px 1px #d5d8ec;
  margin: 8px;
  flex: 1;
  transition: box-shadow 0.2s;
}

.card.hover {
  cursor: pointer;
  box-shadow: 0 2px 6px 4px #d5d8ec;
}

.body-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 16px;
}

.image {
  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  width: 75px;
}

.body {
  padding-left: 12px;
}

.deets {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.name {
  color: #575769;
  white-space: nowrap;
}

.role {
  margin-left: 6px;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  padding: 8px;
  background-color: rgba(0, 0, 50, 0.05);
}
</style>
