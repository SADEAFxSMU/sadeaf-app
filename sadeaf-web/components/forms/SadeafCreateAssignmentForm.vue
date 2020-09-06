<template>
  <div>
    <div class="client">
      <user-card :user="client.account" />
    </div>
    <el-form :model="form" label-width="150px">
      <el-form-item label="Address">
        <div style="display: flex; margin-top: 5px">
          <el-input v-model="form.address_line_one"
                    placeholder="Address Line 1" />
          <el-input v-model="form.room_number"
                    style="margin-left: 5px; width: 200px;"
                    placeholder="Room Number" />
        </div>
        <div style="display: flex; margin-top: 5px">
          <el-input v-model="form.address_line_two"
                    placeholder="Address Line 2" />
          <el-input v-model="form.postal"
                    style="margin-left: 5px; width: 150px;"
                    placeholder="Postal Code" />
        </div>
      </el-form-item>
      <el-form-item label="Dates">
        <el-date-picker v-model="form.start_dt"
                        placeholder="Start"
                        type="datetime" />
        -
        <el-date-picker v-model="form.end_dt"
                        placeholder="End"
                        type="datetime" />
      </el-form-item>
      <el-form-item label="Status">
        <el-select v-model="form.status">
          <el-option v-for="status in assignmentStatuses"
                     :key="'opt-' + status"
                     :value="status">
            {{ status }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Volunteer">
        <div v-if="volunteer" class="current-volunteer-info">
          <user-card-horizontal-small :user="volunteer.account" />
          <small-delete-button @click="replaceVolunteer(null)" />
        </div>
        <div>
          <volunteer-search @select="replaceVolunteer" />
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
          <el-popconfirm confirmButtonText='Confirm'
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
import { ASSIGNMENT_STATUSES } from "../../common/types/constants";
import UserCardHorizontalSmall from "../user/UserCardHorizontalSmall";
import VolunteerSearch from "../user/VolunteerSearch";
import UserCard from "../user/UserCard";
import _ from 'lodash';
import gql from 'graphql-tag';
import SmallDeleteButton from "../buttons/SmallDeleteButton";

const UPDATE_ASSIGNMENT = gql`mutation UpdateAssignment(
  $id: Int!
  $address_line_one: String
  $address_line_two: String
  $end_dt: timestamp
  $postal: String
  $room_number: String
  $start_dt: timestamp
  $status: String
  $volunteer_id: Int
) {
  update_assignment_by_pk(
    pk_columns: { id: $id }
    _set: {
      address_line_one: $address_line_one
      address_line_two: $address_line_two
      end_dt: $end_dt
      id: $id
      postal: $postal
      room_number: $room_number
      start_dt: $start_dt
      status: $status
      volunteer_id: $volunteer_id
    }
  ) {
     address_line_one
     address_line_two
     end_dt
     id
     postal
     room_number
     start_dt
     status
     volunteer_id
  }
}`;

const INSERT_ASSIGNMENT = gql`mutation InsertAssignment(
  $event_id: Int!
  $address_line_one: String
  $address_line_two: String
  $end_dt: timestamp
  $postal: String
  $room_number: String
  $start_dt: timestamp
  $status: String
  $volunteer_id: Int
) {
  insert_assignment_one(
    object: {
      address_line_one: $address_line_one
      address_line_two: $address_line_two
      end_dt: $end_dt
      postal: $postal
      room_number: $room_number
      start_dt: $start_dt
      status: $status
      volunteer_id: $volunteer_id
      event_id: $event_id
    }
  ) {
     address_line_one
     address_line_two
     end_dt
     id
     postal
     room_number
     start_dt
     status
     volunteer {
       id
       account {
         id
         name
         username
         email
       }
     }
     event_id
  }
}`;

const DELETE_ASSIGNMENT = gql`mutation DeleteAssignmentByPk($id: Int!) {
  delete_assignment_by_pk(id: $id) {
    id
  }
}`;

export default {
  name: "SadeafCreateAssignmentForm",
  components: {SmallDeleteButton, UserCard, VolunteerSearch, UserCardHorizontalSmall},
  props: {
    client: {
      type: Object,
      required: true,
    },
    assignment: {
      type: Object,
      required: false,
      default: null,
    },
    event_id: {
      type: Number,
      required: false,
    }
  },

  data() {
    return {
      form: {},
      assignmentStatuses: ASSIGNMENT_STATUSES,
      volunteer: null,
    }
  },

  created() {
    this.setForm(this.assignment);
  },

  methods: {
    replaceVolunteer(volunteer) {
      this.volunteer = volunteer;
    },
    setForm(assignment) {
      if (assignment) {
        // Update operation - set form values to current values
        const { volunteer } = assignment;
        if (volunteer) {
          this.volunteer = volunteer;
        }
        _.forOwn(assignment, (value, fieldName) => {
          this.$set(this.form, fieldName, value);
        });
      } else {
        // Insert operation - init empty form
        this.resetValues();
      }
    },
    handleConfirm() {
      if (this.isUpdate) {
        this.updateAssignment();
      } else {
        this.insertAssignment();
      }
      this.$emit('update', this.form);
    },
    handleCancel() {
      this.$emit('cancel');
    },
    handleDelete() {
      this.deleteAssignment();
    },
    async insertAssignment() {
      await this.$apollo.mutate({
        mutation: INSERT_ASSIGNMENT,
        variables: {
          address_line_one: this.form.address_line_one,
          address_line_two: this.form.address_line_two,
          end_dt: this.form.end_dt,
          latitude: this.form.latitude,
          longitude: this.form.longitude,
          postal: this.form.postal,
          room_number: this.form.room_number,
          start_dt: this.form.start_dt,
          status: this.form.status,
          volunteer_id: (this.volunteer && this.volunteer.id) || null,
          event_id: this.event_id,
        }
      });
      this.onOperationSuccess();
      this.$notify.success('Assignment created!');
    },
    async updateAssignment() {
      await this.$apollo.mutate({
        mutation: UPDATE_ASSIGNMENT,
        variables: {
          id: this.form.id,
          address_line_one: this.form.address_line_one,
          address_line_two: this.form.address_line_two,
          end_dt: this.form.end_dt,
          latitude: this.form.latitude,
          longitude: this.form.longitude,
          postal: this.form.postal,
          room_number: this.form.room_number,
          start_dt: this.form.start_dt,
          status: this.form.status,
          volunteer_id: (this.volunteer && this.volunteer.id) || null,
        }
      })
      this.onOperationSuccess();
      this.$notify.success('Assignment updated!');
    },
    async deleteAssignment() {
      await this.$apollo.mutate({
        mutation: DELETE_ASSIGNMENT,
        variables: {
          id: this.assignment.id
        }
      })
      this.onOperationSuccess();
      this.$notify.success('Assignment deleted!');
    },

    onOperationSuccess() {
      this.resetValues();
      this.$emit('success');
    },

    resetValues() {
      this.form = {};
      this.volunteer = null;
    }
  },

  computed: {
    isUpdate() {
      return this.assignment !== null;
    }
  },

  watch: {
    assignment: {
      handler(assignment) {
        this.setForm(assignment);
      },
      deep: true,
    }
  }
};
</script>

<style scoped>
.client {
  margin-bottom: 12px;
}
.current-volunteer-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
