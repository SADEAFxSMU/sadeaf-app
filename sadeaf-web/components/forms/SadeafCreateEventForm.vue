<template>
  <div>
    <el-form :model="form"
             :label-width="150 + 'px'">
      <el-form-item label="Event Name" required>
        <el-input v-model="form.name"
                  placeholder="IS111 - Introduction to Programming" />
      </el-form-item>
      <el-form-item label="Purpose" required>
        <div style="display: flex;">
          <el-select v-model="form.purpose"
                     placeholder="School">
            <el-option v-for="option in eventPurposeOptions"
                       :key="'opt-' + option"
                       :value="option">
              {{ option }}
            </el-option>
          </el-select>
          <el-input v-if="form.purpose === 'Other'"
                    style="margin-left: 6px;"
                    placeholder="Purpose"
                    v-model="form.purposeOther" />
        </div>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description"
                  placeholder="..." />
      </el-form-item>
      <el-form-item label="Quotation">
        <el-input-number v-model="form.quotation" />
      </el-form-item>
      <el-form-item label="Client">
        <div v-if="client">
          <user-card-horizontal-small :user="client.account" />
        </div>
        <div>
          <client-search @select="replaceClient" />
        </div>
      </el-form-item>
      <el-form-item >
        <div style="display: flex; justify-content: space-between;">
          <el-button-group>
            <el-button @click="handleConfirm">
              Confirm
            </el-button>
            <el-button @click="handleCancel">
              Cancel
            </el-button>
          </el-button-group>
          <el-popconfirm v-if="event"
                        confirmButtonText='Confirm'
                        cancelButtonText='Cancel'
                        icon="el-icon-info"
                        iconColor="red"
                        title="Are you sure you want to delete this?"
                        @onConfirm="handleDelete">
            <el-button slot="reference"
                       type="danger">
              Delete
            </el-button>
          </el-popconfirm>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { EVENT_PURPOSE_OPTIONS } from "../../common/types/constants";
import UserCardHorizontalSmall from "../user/UserCardHorizontalSmall";
import UserCard from "../user/UserCard";
import _ from 'lodash';
import gql from 'graphql-tag';
import ClientSearch from "../user/ClientSearch";

const UPDATE_EVENT = gql`mutation UpdateEvent(
  $client_id: Int
  $description: String
  $id: Int!
  $name: String
  $purpose: String
  $quotation: numeric
) {
  update_event_by_pk(
    pk_columns: { id: $id }
    _set: {
      client_id: $client_id
      description: $description
      id: $id
      name: $name
      purpose: $purpose
      quotation: $quotation
    }
  ) {
    client_id
    created_at
    description
    id
    name
    purpose
    quotation
    updated_at
  }
}`;

const INSERT_EVENT = gql`mutation InsertEvent(
  $client_id: Int
  $description: String
  $name: String
  $purpose: String
  $quotation: numeric
) {
  insert_event_one(
    object: {
      client_id: $client_id
      description: $description
      name: $name
      purpose: $purpose
      quotation: $quotation
    }
  ) {
    client_id
    created_at
    description
    id
    name
    purpose
    quotation
    updated_at
  }
}`;

const DELETE_EVENT = gql`mutation DeleteEventByPk($id: Int!) {
  delete_event_by_pk(id: $id) {
    id
  }
}`;

export default {
  name: "SadeafCreateEventForm",
  components: {ClientSearch, UserCard, UserCardHorizontalSmall},
  props: {
    event: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      form: {},
      client: null,
      eventPurposeOptions: EVENT_PURPOSE_OPTIONS,
    }
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
        const { client } = event;
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
      if (this.isUpdate) {
        this.updateEvent();
      } else {
        this.insertEvent();
      }
      this.$emit('update', this.form);
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
          quotation: this.form.quotation,
        }
      });
      this.event = data.event;
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
          quotation: this.form.quotation,
        }
      })
      this.event = data.event;
      this.onOperationSuccess();
      this.$notify.success('Event updated!');
    },
    async deleteEvent() {
      await this.$apollo.mutate({
        mutation: DELETE_EVENT,
        variables: {
          id: this.event.id
        }
      });
      this.onOperationSuccess();
      this.$notify.success('Event deleted!');
    },

    onOperationSuccess() {
      this.$emit('success');
      this.resetState();
    },

    resetState() {
      this.form = {};
      this.client = null;
    }
  },

  computed: {
    isUpdate() {
      return this.event !== null;
    },
    client() {
      return this.event && this.event.client;
    }
  },

  watch: {
    event: {
      handler(event) {
        this.setForm(event);
      },
      deep: true,
    }
  }
};
</script>

<style scoped>
</style>
