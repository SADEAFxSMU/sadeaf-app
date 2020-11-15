<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Event Name" required>
        <el-input v-model="form.name" placeholder="IS111 - Introduction to Programming" />
      </el-form-item>
      <el-form-item label="Purpose" required>
        <div style="display: flex">
          <el-select v-model="form.purpose" placeholder="School">
            <el-option v-for="option in EVENT_PURPOSE_OPTIONS" :key="'p-opt-' + option" :value="option">
              {{ option }}
            </el-option>
          </el-select>
          <el-input
            v-if="form.purpose === 'Other'"
            style="margin-left: 6px"
            placeholder="Purpose"
            v-model="form.purposeOther"
          />
        </div>
      </el-form-item>
      <el-form-item label="Topic">
        <el-select v-model="form.topic" placeholder="Choose one">
          <el-option v-for="option in EVENT_CATEGORY_OPTIONS" :key="'t-opt-' + option" :value="option">
            {{ option }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Edu Level Needed">
        <el-select v-model="form.eduLevel" placeholder="Choose one">
          <el-option v-for="option in EVENT_EDUCATION_OPTIONS" :key="'e-opt-' + option" :value="option">
            {{ option }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.eventSkillRequirements"
        label="Skill Requirements"
        prop="eventSkillRequirements"
        required
      >
        <el-checkbox-group v-model="form.eventSkillRequirements">
          <el-checkbox label="Notetaking" name="type"></el-checkbox>
          <el-checkbox label="Interpretation" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description" placeholder="..." />
      </el-form-item>
      <el-form-item label="Client">
        <div v-if="client">
          <user-card-horizontal-small :user="client.account" />
        </div>
        <div>
          <client-search @select="replaceClient" />
        </div>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: space-between">
          <el-button-group>
            <el-button @click="handleConfirm"> Confirm</el-button>
            <el-button @click="handleCancel"> Cancel</el-button>
          </el-button-group>
          <el-popconfirm
            v-if="isUpdate"
            confirmButtonText="Confirm"
            cancelButtonText="Cancel"
            icon="el-icon-info"
            iconColor="red"
            title="Are you sure you want to delete this?"
            @onConfirm="handleDelete"
          >
            <el-button slot="reference" type="danger"> Delete</el-button>
          </el-popconfirm>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  EVENT_PURPOSE_OPTIONS,
  EVENT_CATEGORY_OPTIONS,
  EVENT_EDUCATION_OPTIONS,
  EVENT_CATEGORY_OPTIONS_DEFAULT,
  EVENT_EDUCATION_OPTIONS_DEFAULT,
} from '../../common/types/constants';
import UserCardHorizontalSmall from '../user/UserCardHorizontalSmall';
import UserCard from '../user/UserCard';
import _ from 'lodash';
import gql from 'graphql-tag';
import ClientSearch from '../user/ClientSearch';

const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $notetaker_required: Boolean!
    $interpreter_required: Boolean!
    $client_id: Int
    $description: String
    $id: Int!
    $name: String
    $purpose: String
  ) {
    update_event_by_pk(
      pk_columns: { id: $id }
      _set: {
        notetaker_required: $notetaker_required
        interpreter_required: $interpreter_required
        client_id: $client_id
        description: $description
        id: $id
        name: $name
        purpose: $purpose
      }
    ) {
      client_id
      created_at
      description
      id
      name
      purpose
      updated_at
    }
  }
`;

const INSERT_EVENT = gql`
  mutation InsertEvent(
    $notetaker_required: Boolean!
    $interpreter_required: Boolean!
    $client_id: Int
    $description: String
    $name: String
    $purpose: String
    $category: String
    $education: String
  ) {
    insert_event_one(
      object: {
        notetaker_required: $notetaker_required
        interpreter_required: $interpreter_required
        client_id: $client_id
        description: $description
        name: $name
        purpose: $purpose
        category: $category
        education: $education
      }
    ) {
      client_id
      created_at
      description
      id
      name
      purpose
      category
      education
      updated_at
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEventByPk($id: Int!) {
    delete_event_by_pk(id: $id) {
      id
    }
  }
`;

export default {
  name: 'SadeafCreateEventForm',
  components: { ClientSearch, UserCard, UserCardHorizontalSmall },
  props: {
    event: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      form: {
        eventSkillRequirements: [],
      },
      rules: {
        eventSkillRequirements: [
          {
            validator: (rule, value, callback) => {
              if (this.form.eventSkillRequirements.length > 0) {
                callback();
              } else {
                callback(new Error('Please enter an event skill!'));
              }
            },
          },
        ],
      },
      client: null,
      EVENT_PURPOSE_OPTIONS,
      EVENT_CATEGORY_OPTIONS,
      EVENT_EDUCATION_OPTIONS,
    };
  },

  created() {
    this.setForm(this.event);
  },

  methods: {
    replaceClient(client) {
      this.client = client;
    },
    setForm(event) {
      if (event) {
        const {
          client,
          skillsRequired: { notetakerRequired, interpreterRequired },
        } = event;
        const skillRequirements = [];

        if (notetakerRequired) {
          skillRequirements.push('Notetaking');
        }
        if (interpreterRequired) {
          skillRequirements.push('Interpretation');
        }
        this.$set(this.form, 'eventSkillRequirements', skillRequirements);

        if (client) {
          this.client = client;
        }
        _.forOwn(event, (value, fieldName) => {
          this.$set(this.form, fieldName, value);
        });
        if (event.purpose && !EVENT_PURPOSE_OPTIONS.includes(event.purpose)) {
          this.$set(this.form, 'purpose', 'Other');
          this.$set(this.form, 'purposeOther', event.purpose);
        }
      } else {
        this.resetState();
      }
    },
    handleConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.isUpdate) {
            await this.updateEvent();
          } else {
            await this.insertEvent();
          }
          this.$emit('update', this.form);
        }
      });
    },
    handleCancel() {
      this.$emit('cancel');
    },
    handleDelete() {
      this.deleteEvent();
    },
    async insertEvent() {
      const { data } = await this.$apollo.mutate({
        mutation: INSERT_EVENT,
        variables: {
          client_id: this.client.id,
          description: this.form.description,
          name: this.form.name,
          purpose: this.form.purposeOther || this.form.purpose,
          category: this.form.topic || EVENT_CATEGORY_OPTIONS_DEFAULT,
          education: this.form.eduLevel || EVENT_EDUCATION_OPTIONS_DEFAULT,
          notetaker_required: this.form.eventSkillRequirements.includes('Notetaking'),
          interpreter_required: this.form.eventSkillRequirements.includes('Interpretation'),
        },
      });
      // this.event = data.event;
      this.onOperationSuccess();
      this.$notify.success('Event created!');
    },
    async updateEvent() {
      const { data } = await this.$apollo.mutate({
        mutation: UPDATE_EVENT,
        variables: {
          id: this.form.id,
          client_id: this.client.id,
          description: this.form.description,
          name: this.form.name,
          purpose: this.form.purposeOther || this.form.purpose,
          category: this.form.topic || EVENT_CATEGORY_OPTIONS_DEFAULT,
          education: this.form.eduLevel || EVENT_EDUCATION_OPTIONS_DEFAULT,
          notetaker_required: this.form.eventSkillRequirements.includes('Notetaking'),
          interpreter_required: this.form.eventSkillRequirements.includes('Interpretation'),
        },
      });
      // this.event = data.event;
      this.onOperationSuccess();
      this.$notify.success('Event updated!');
    },
    async deleteEvent() {
      await this.$apollo.mutate({
        mutation: DELETE_EVENT,
        variables: {
          id: this.event.id,
        },
      });
      this.onOperationSuccess();
      this.$notify.success('Event deleted!');
    },

    onOperationSuccess() {
      this.$emit('success');
      this.resetState();
    },

    resetState() {
      this.form = { eventSkillRequirements: [] };
      this.client = null;
    },
  },

  computed: {
    isUpdate() {
      return this.event !== null;
    },
  },

  watch: {
    event: {
      handler(event) {
        this.setForm(event);
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
