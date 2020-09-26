<template>
  <div>
    <div class="volunteer">
      <div v-if="assignedVolunteer">
        <h3>Assigned Volunteer</h3>
        <user-card :user="assignedVolunteer.account" />
      </div>
      <div v-else class="pending-volunteer">
        <el-icon name="loading" />
        <h1 class="title">Pending Volunteer</h1>
      </div>
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
      <el-form-item>
        <danger-zone>
          <div class="cancel-field">
            <div>
              <h3 class="heading">Cancel this session</h3>
              <p class="body">
                NOTE: Last minute cancellation of appointments are strictly discouraged. It will
                not only affect volunteers, but also ...
              </p>
            </div>
            <el-popconfirm confirmButtonText='Confirm'
                          cancelButtonText='Cancel'
                          icon="el-icon-info"
                          iconColor="red"
                          title="Are you sure you want to cancel this assignment?"
                          @onConfirm="handleDelete">
              <el-button slot="reference"
                         type="danger"
                         size="mini">
                Cancel
              </el-button>
            </el-popconfirm>
          </div>
        </danger-zone>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; justify-content: space-between;">
          <el-button-group>
            <el-button @click="handleConfirm">
              Confirm
            </el-button>
          </el-button-group>

        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UserCard from "../user/UserCard";
import gql from 'graphql-tag';
import _ from 'lodash';
import DangerZone from "./DangerZone";

const UPDATE_ASSIGNMENT = gql`
  mutation UpdateAssignment(
    $id: Int!
    $address_line_one: String
    $address_line_two: String
    $start_dt: timestamp
    $end_dt: timestamp
    $latitude: float8
    $longitude: float8
    $postal: String
    $room_number: String
  ) {
    update_assignment_by_pk(
      pk_columns: { id: $id }
      _set: {
        address_line_one: $address_line_one
        address_line_two: $address_line_two
        start_dt: $start_dt
        end_dt: $end_dt
        latitude: $latitude
        longitude: $longitude
        postal: $postal
        room_number: $room_number
      }
    ) {
      address_line_one
      address_line_two
      start_dt
      end_dt
      latitude
      longitude
      postal
      room_number
    }
  }
`;

const DELETE_ASSIGNMENT = gql`mutation DeleteAssignmentByPk($id: Int!) {
  delete_assignment_by_pk(id: $id) {
    id
  }
}`;

export default {
  name: "ClientUpsertAssignmentForm",

  props: {
    assignment: {
      type: Object,
      required: false,
    }
  },

  components: {
    DangerZone,
    UserCard,
  },

  data() {
    return {
      form: {},
    }
  },

  created() {
    this.setForm(this.assignment);
  },

  methods: {
    setForm(assignment) {
      if (assignment) {
        _.forOwn(assignment, (value, fieldName) => {
          this.$set(this.form, fieldName, value);
        });
      } else {
        this.resetValues();
      }
    },

    handleConfirm() {
      if (this.isUpdate) {
        this.updateAssignment();
        this.$notify.success('Assignment updated!');
      } else {
        this.insertAssignment();
        this.$notify.success('Assignment created!');
      }
      this.onOperationSuccess();
    },
    handleCancel() {
      this.$emit('cancel');
    },
    async handleDelete() {
      await this.deleteAssignment();
      this.onOperationSuccess();
      this.$notify.success('Assignment deleted!');
    },

    async insertAssignment() {
      const {
        address_line_one,
        address_line_two,
        end_dt,
        latitude,
        longitude,
        postal,
        room_number,
        start_dt,
      } = this.form;
      await this.$apollo.mutate({
        mutation: INSERT_ASSIGNMENT,
        variables: {
          address_line_one,
          address_line_two,
          end_dt,
          latitude,
          longitude,
          postal,
          room_number,
          start_dt,
        }
      });
    },

    async updateAssignment() {
      const {
        address_line_one,
        address_line_two,
        end_dt,
        latitude,
        longitude,
        postal,
        room_number,
        start_dt,
      } = this.form;
      await this.$apollo.mutate({
        mutation: UPDATE_ASSIGNMENT,
        variables: {
          id: this.assignment.id,
          address_line_one,
          address_line_two,
          end_dt,
          latitude,
          longitude,
          postal,
          room_number,
          start_dt,
        }
      })
    },

    async deleteAssignment() {
      await this.$apollo.mutate({
        mutation: DELETE_ASSIGNMENT,
        variables: {
          id: this.assignment.id
        }
      })
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
    client() {
      return this.$store.state.auth.user.client;
    },
    assignedVolunteer() {
      const assignment = this.assignment;
      return assignment && assignment.volunteer;
    },
    isUpdate() {
      return Boolean(this.assignment);
    },
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
.volunteer {
  padding: 12px;
  margin-bottom: 6px;
}

.pending-volunteer {
  display: flex;
  align-items: center;
}
.pending-volunteer .title {
  margin-left: 8px;
}

.cancel-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cancel-field .heading {
  color: #be5555;
}
.cancel-field .body {
  opacity: 0.7;
  line-height: 18px;
  word-break: keep-all;
}
</style>
