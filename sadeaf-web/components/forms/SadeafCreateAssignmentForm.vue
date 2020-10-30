<template>
  <div>
    <div class="client">
      <user-card :user="client.account" />
    </div>
    <el-form :model="form" label-width="150px">
      <el-form-item label="Address">
        <div style="display: flex; margin-top: 5px">
          <address-search
            @select="replaceAddress"
            @clear="handleClear"
            v-if="assignment"
            :key="assignment.address_line_one"
            :existingAddress="address['ADDRESS']"
          />
          <address-search @select="replaceAddress" v-else />
        </div>
        <div style="display: flex; margin-top: 5px">
          <el-input v-model="form.address_line_two" placeholder="Building Name" />
        </div>
        <div style="display: flex; margin-top: 5px">
          <el-input v-model="form.postal" style="width: 250px" placeholder="Postal Code" />
          <el-input v-model="form.room_number" style="margin-left: 5px; width: 250px" placeholder="Room Number" />
        </div>
      </el-form-item>
      <el-form-item label="Dates">
        <el-date-picker v-model="form.start_dt" placeholder="Start" type="datetime" />
        -
        <el-date-picker v-model="form.end_dt" placeholder="End" type="datetime" />
      </el-form-item>
      <el-form-item label="Status">
        <el-select v-model="form.status">
          <el-option v-for="status in assignmentStatuses" :key="'opt-' + status" :value="status">
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
      <el-form-item>
        <div style="display: flex; justify-content: space-between">
          <el-button-group>
            <el-button @click="handleConfirm"> Confirm </el-button>
            <el-button @click="handleCancel"> Cancel </el-button>
          </el-button-group>
          <el-popconfirm
            confirmButtonText="Confirm"
            cancelButtonText="Cancel"
            icon="el-icon-info"
            iconColor="red"
            title="Are you sure you want to delete this?"
            @onConfirm="handleDelete"
          >
            <el-button slot="reference" type="danger"> Delete </el-button>
          </el-popconfirm>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ASSIGNMENT_STATUSES } from '../../common/types/constants';
import UserCardHorizontalSmall from '../user/UserCardHorizontalSmall';
import VolunteerSearch from '../user/VolunteerSearch';
import UserCard from '../user/UserCard';
import _ from 'lodash';
import gql from 'graphql-tag';
import SmallDeleteButton from '../buttons/SmallDeleteButton';
import AddressSearch from '~/components/forms/AddressSearch';

const UPDATE_ASSIGNMENT = gql`
  mutation UpdateAssignment(
    $id: Int!
    $address_line_one: String
    $address_line_two: String
    $end_dt: timestamp
    $postal: String
    $latitude: float8
    $longitude: float8
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
        latitude: $latitude
        longitude: $longitude
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
      latitude
      longitude
      room_number
      start_dt
      status
      volunteer_id
    }
  }
`;

const INSERT_ASSIGNMENT = gql`
  mutation InsertAssignment(
    $event_id: Int!
    $address_line_one: String
    $address_line_two: String
    $end_dt: timestamp
    $postal: String
    $latitude: float8
    $longitude: float8
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
        latitude: $latitude
        longitude: $longitude
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
      latitude
      longitude
      room_number
      start_dt
      status
      volunteer {
        id
        account {
          id
          name
          email
        }
      }
      event_id
    }
  }
`;

const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignmentByPk($id: Int!) {
    delete_assignment_by_pk(id: $id) {
      id
    }
  }
`;

export default {
  name: 'SadeafCreateAssignmentForm',
  components: { AddressSearch, SmallDeleteButton, UserCard, VolunteerSearch, UserCardHorizontalSmall },
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
    },
  },

  data() {
    return {
      form: {},
      assignmentStatuses: ASSIGNMENT_STATUSES,
      volunteer: null,
      address: { ADDRESS: this.assignment ? this.assignment.address_line_one : '' },
    };
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
          address_line_one: this.address['ADDRESS'],
          address_line_two: this.form.address_line_two,
          end_dt: this.form.end_dt,
          latitude: this.address['LATITUDE'],
          longitude: this.address['LONGITUDE'],
          postal: this.form.postal,
          room_number: this.form.room_number,
          start_dt: this.form.start_dt,
          status: this.form.status,
          volunteer_id: (this.volunteer && this.volunteer.id) || null,
          event_id: this.event_id,
        },
      });
      this.onOperationSuccess();
      this.$notify.success('Assignment created!');
    },
    async updateAssignment() {
      await this.$apollo.mutate({
        mutation: UPDATE_ASSIGNMENT,
        variables: {
          id: this.form.id,
          address_line_one: this.address['ADDRESS'],
          address_line_two: this.form.address_line_two,
          end_dt: this.form.end_dt,
          latitude: this.address['LATITUDE'],
          longitude: this.address['LONGITUDE'],
          postal: this.form.postal,
          room_number: this.form.room_number,
          start_dt: this.form.start_dt,
          status: this.form.status,
          volunteer_id: (this.volunteer && this.volunteer.id) || null,
        },
      });
      this.onOperationSuccess();
      this.$notify.success('Assignment updated!');
    },
    async deleteAssignment() {
      await this.$apollo.mutate({
        mutation: DELETE_ASSIGNMENT,
        variables: {
          id: this.assignment.id,
        },
      });
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
    },
    replaceAddress(address) {
      this.address = address;
      this.$set(this.form, 'address_line_two', this.address['BUILDING']);
      this.$set(this.form, 'postal', this.address['POSTAL']);
    },
    handleClear() {
      this.address = { ADDRESS: '' };
      this.$set(this.form, 'address_line_two', '');
      this.$set(this.form, 'postal', '');
    },
  },

  computed: {
    isUpdate() {
      return this.assignment !== null;
    },
  },

  watch: {
    assignment: {
      handler(assignment) {
        this.setForm(assignment);
        if (assignment) {
          this.address = { ADDRESS: assignment.address_line_one };
        }
      },
      deep: true,
    },
  },
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
