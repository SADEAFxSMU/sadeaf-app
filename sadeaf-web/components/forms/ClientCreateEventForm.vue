<template>
  <div>
    <el-form :model="form"
             :rules="rules"
             ref="form"
             label-width="150px">
      <el-form-item label="Event Name" prop="name" required>
        <el-input v-model="form.name"
                  placeholder="IS111 - Introduction to Programming" />
      </el-form-item>
      <el-form-item label="Purpose" prop="purpose" required>
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
      <el-form-item label="Description" prop="description">
        <el-input type="textarea"
                  v-model="form.description"
                  placeholder="..." />
      </el-form-item>
      <el-form-item prop="time">
        <template v-slot:label>
          <el-icon name="time" />
        </template>
        <div>
          <el-row>
            <el-col :xs="24" :lg="12">
              <el-form-item prop="date" required>
                <el-date-picker v-model="form.date"
                                placeholder="Date"
                                style="width: 100%; padding-right: 8px;" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item prop="start_time" required>
                <el-time-picker v-model="form.start_time"
                                format="HH:mm"
                                placeholder="Start"
                                style="width: 120px;" />
              </el-form-item>
              -
              <el-form-item prop="end_time" required>
                <el-time-picker v-model="form.end_time"
                                format="HH:mm"
                                placeholder="End"
                                style="width: 120px" />
              </el-form-item>
            </el-col>
          </el-row>
          <div style="margin-top: 4px;">
            <el-form-item prop="repeat">
              <el-select v-model="form.repeat"
                         placeholder="Repeats every">
                <el-option :value="REPEAT_OPTS.DOES_NOT_REPEAT"
                           label="Does not repeat" />
                <el-option :value="REPEAT_OPTS.WEEKLY"
                           :label="'Weekly on ' + day"/>
                <!-- More options -->
              </el-select>
            </el-form-item>
            <div v-if="form.repeat !== REPEAT_OPTS.DOES_NOT_REPEAT">
              <el-form-item prop="repeatCount">
                <el-input-number v-model="form.repeatCount"
                                 size="small"
                                 placeholder="Count"
                                 :min="1"
                                 :max="100">
                </el-input-number>
              </el-form-item>
              Times
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item required>
        <template v-slot:label>
          <el-icon name="location" />
        </template>
        <!-- Assignments -->
        <div style="display: flex;">
          <div style="flex: 2; width: 100%;">
            <div style="margin-bottom: 8px;">
              <p>Location</p>
              <div style="display: flex; margin-top: 5px;">
                <el-form-item prop="address_line_one" required>
                  <el-input v-model="form.address_line_one"
                            placeholder="Address Line 1" />
                </el-form-item>
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
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item >
        <div style="display: flex; justify-content: space-between;">
          <el-button-group>
            <el-button @click="submitForm">
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
import gql from 'graphql-tag';
import SmallDeleteButton from "../buttons/SmallDeleteButton";

const INSERT_EVENT = gql`
  mutation InsertEvent(
    $name: String!
    $client_id: Int!
    $description: String
    $purpose: String
    $assignments: assignment_arr_rel_insert_input
  ) {
    insert_event_one(
      object: {
        name: $name
        client_id: $client_id
        description: $description
        purpose: $purpose
        assignments: $assignments
      }
    ) {
      id
      name
      client_id
      description
      purpose
      assignments {
        id
        address_line_one
        address_line_two
        end_dt
        event_id
        latitude
        longitude
        postal
        room_number
        start_dt
      }
    }
  }
`;

const REPEAT_OPTS = {
  DOES_NOT_REPEAT: 1,
  WEEKLY: 2,
}

export default {
  name: "ClientCreateEventForm",
  components: {SmallDeleteButton, UserCard, UserCardHorizontalSmall},
  props: {
    date: {
      type: Date,
      required: true,
    },
  },
  data() {
    return {
      event: null,
      rules: {
        name: [
          { required: true, message: 'Please enter a name for this Event', trigger: 'blur' },
        ],
        purpose: [
          { required: true, message: 'Please enter a purpose' }
        ],
        date: [
          { required: true, message: 'Please enter a date' }
        ],
        start_time: [
          { required: true, message: 'Please enter a start time' },
          {
            validator: (rule, value, callback) => {
              if (value > this.form.end_time) {
                callback(new Error('Start time must be before end time'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        end_time: [
          { required: true, message: 'Please enter an end time' },
          {
            validator: (rule, value, callback) => {
              if (value < this.form.start_time) {
                callback(new Error('End time must be after start time'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        repeat: [
          { required: true, message: 'Please select an option' }
        ],
        repeatCount: [
          { required: true, message: 'Please indicate a count' }
        ],
      },
      form: {
        // default values
        date: this.date,
        repeat: REPEAT_OPTS.DOES_NOT_REPEAT,
        repeatCount: 1,
      },
      eventPurposeOptions: EVENT_PURPOSE_OPTIONS,
    }
  },

  created() {
    this.REPEAT_OPTS = REPEAT_OPTS;
    // this.setForm(this.event);
  },

  methods: {

    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.insertEvent();
          this.onOperationSuccess();
          this.$notify.success('Service request created!');
        } else {
          console.log('error submit!!');
          return false;
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
          assignments: { data: this.assignments },
        }
      });
      this.event = data.insert_event_one;
      return data.insert_event_one.id;
    },

    onOperationSuccess() {
      this.$emit('success');
      this.resetState();
    },

    resetState() {
      this.form = {};
    },
  },

  computed: {
    client() {
      return this.$store.state.auth.client;
    },
    isUpdate() {
      return this.event !== null;
    },
    day() {
      return this.$dayjs(this.date).format('dddd');
    },
    assignments() {
      let {
        date,
        start_time,
        end_time,
        address_line_one,
        address_line_two,
        postal,
        room_number,
        repeat,
        repeatCount,
      } = this.form;
      const assignments = [];

      if (repeat === REPEAT_OPTS.DOES_NOT_REPEAT) {
        repeatCount = 1;
      }
      if (!repeatCount) {
        repeatCount = 1;
      }

      let start_dt = this.$dayjs(date)
        .set('hour', start_time.getHours())
        .set('minute', start_time.getMinutes())
        .set('second', start_time.getSeconds());
      let end_dt = this.$dayjs(date)
        .set('hour', end_time.getHours())
        .set('minute', end_time.getMinutes())
        .set('second', end_time.getSeconds());

      for (let i = 0; i < repeatCount; i++) {
        assignments.push({
          address_line_one,
          address_line_two,
          postal,
          room_number,
          start_dt: start_dt.add(7 * i, 'day'),
          end_dt: end_dt.add(7 * i, 'day'),
        });
      }
      return assignments;
    }
  },

  watch: {
    date(val) {
      this.$set(this.form, 'date', val);
    },
  }
};
</script>

<style scoped>
</style>
