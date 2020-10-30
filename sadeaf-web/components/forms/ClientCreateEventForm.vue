<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
      <el-form-item label="Event Name" prop="name" required>
        <el-input v-model="form.name" placeholder="IS111 - Introduction to Programming" />
      </el-form-item>
      <el-form-item label="Event Skill Requirements" prop="eventSkillRequirements" required>
        <el-checkbox-group v-model="form.eventSkillRequirements">
          <el-checkbox label="Notetaking" name="type"></el-checkbox>
          <el-checkbox label="Interpretation" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Purpose" prop="purpose" required>
        <div class="field-purpose">
          <el-select v-model="form.purpose" placeholder="School">
            <el-option v-for="option in eventPurposeOptions" :key="'opt-' + option" :value="option">
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
      <el-form-item label="Description" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="..." />
      </el-form-item>
      <el-form-item prop="time">
        <template v-slot:label>
          <div class="required-asterisk">
            <el-icon name="time" />
          </div>
        </template>
        <div>
          <el-row>
            <el-col :xs="24" :lg="12">
              <el-form-item prop="date" required>
                <el-date-picker v-model="form.date" placeholder="Date" style="width: 100%; padding-right: 8px" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item prop="duration">
                <el-time-picker v-model="form.start_time" format="HH:mm" placeholder="Start" style="width: 120px" />
                -
                <el-time-picker v-model="form.end_time" format="HH:mm" placeholder="End" style="width: 120px" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="field-repeat">
            <el-form-item prop="repeat">
              <el-select v-model="form.repeat" placeholder="Repeats every">
                <el-option :value="REPEAT_OPTS.DOES_NOT_REPEAT" label="Does not repeat" />
                <el-option :value="REPEAT_OPTS.WEEKLY" :label="'Weekly on ' + day" />
                <!-- More options -->
              </el-select>
            </el-form-item>
            <div v-if="form.repeat !== REPEAT_OPTS.DOES_NOT_REPEAT">
              <el-form-item prop="repeatCount">
                <el-input-number v-model="form.repeatCount" size="small" placeholder="Count" :min="1" :max="100">
                </el-input-number>
              </el-form-item>
              Times
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="location">
        <template v-slot:label>
          <div class="required-asterisk">
            <el-icon name="location" />
          </div>
        </template>
        <div class="field-location">
          <p>Location</p>
          <div class="body">
              <address-search @select="replaceAddress" @clear="clearAddress"/>
          </div>
          <div class="body">
            <el-input v-model="form.address_line_two" placeholder="Building Name" />
          </div>
          <div class="body">
            <el-input v-model="form.postal" style="margin-right: 5px; width: 250px" placeholder="Postal Code"/>
            <el-input v-model="form.room_number" style="width: 250px" placeholder="Room Number" />
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button @click="submitForm"> Confirm</el-button>
          <el-button @click="handleCancel"> Cancel</el-button>
        </el-button-group>
        <el-popconfirm
          v-if="event"
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
          icon="el-icon-info"
          iconColor="red"
          title="Are you sure you want to delete this?"
          @onConfirm="handleDelete"
        >
          <el-button slot="reference" type="danger"> Delete</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { EVENT_PURPOSE_OPTIONS } from '@/common/types/constants';
import UserCardHorizontalSmall from '../user/UserCardHorizontalSmall';
import UserCard from '../user/UserCard';
import SmallDeleteButton from '../buttons/SmallDeleteButton';
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import AddressSearch from "~/components/forms/AddressSearch";

const INSERT_EVENT = gql`
  mutation InsertEvent(
    $name: String!
    $client_id: Int!
    $description: String
    $purpose: String
    $assignments: assignment_arr_rel_insert_input
    $notetaker_required: Boolean
    $interpreter_required: Boolean
  ) {
    insert_event_one(
      object: {
        name: $name
        client_id: $client_id
        description: $description
        purpose: $purpose
        assignments: $assignments
        notetaker_required: $notetaker_required
        interpreter_required: $interpreter_required
      }
    ) {
      id
      name
      client_id
      description
      purpose
      notetaker_required
      interpreter_required
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
};

export default {
  name: 'ClientCreateEventForm',
  components: {AddressSearch, SmallDeleteButton, UserCard, UserCardHorizontalSmall },
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
        name: [{ required: true, message: 'Please enter a name for this Event', trigger: 'blur' }],
        purpose: [{ required: true, message: 'Please enter a purpose' }],
        date: [{ required: true, message: 'Please enter a date' }],
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
        duration: [
          {
            validator: (_, __, callback) => {
              let { start_time, end_time } = this.form;
              start_time = dayjs(start_time);
              end_time = dayjs(end_time);

              const diff_hours = end_time.diff(start_time, 'hour', false);
              if (diff_hours < 2) {
                callback(new Error('Minimum duration is 2 hours'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        repeat: [{ required: true, message: 'Please select an option' }],
        repeatCount: [{ required: true, message: 'Please indicate a count' }],
        location: [
          {
            validator: (rule, value, callback) => {
              if (this.address){
                callback();
              } else {
                callback(new Error('Please enter a valid address!'));
              }
            },
          },
        ],
      },
      address: null,
      form: {
        // default values
        date: this.date,
        repeat: REPEAT_OPTS.DOES_NOT_REPEAT,
        repeatCount: 1,
        eventSkillRequirements: [],
      },
      eventPurposeOptions: EVENT_PURPOSE_OPTIONS,
    };
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
          assignments : {data: await this.getAssignments()},
          notetaker_required: this.form.eventSkillRequirements.includes('Notetaking'),
          interpreter_required: this.form.eventSkillRequirements.includes('Interpretation'),
        },
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

    async getAssignments() {
      let {
        date,
        start_time,
        end_time,
        address_line_two,
        postal,
        room_number,
        repeat,
        repeatCount,
      } = this.form;
      const assignments = [];

      const address_line_one = this.address['ADDRESS']
      const latitude = this.address['LATITUDE']
      const longitude = this.address['LONGITUDE']

      if (repeat === REPEAT_OPTS.DOES_NOT_REPEAT) {
        repeatCount = 1;
      }
      if (!repeatCount) {
        repeatCount = 1;
      }

      let start_dt = dayjs(date)
        .set('hour', start_time.getHours())
        .set('minute', start_time.getMinutes())
        .set('second', start_time.getSeconds());
      let end_dt = dayjs(date)
        .set('hour', end_time.getHours())
        .set('minute', end_time.getMinutes())
        .set('second', end_time.getSeconds());

      for (let i = 0; i < repeatCount; i++) {
        assignments.push({
          address_line_one,
          address_line_two,
          postal,
          latitude,
          longitude,
          room_number,
          start_dt: start_dt.add(7 * i, 'day'),
          end_dt: end_dt.add(7 * i, 'day'),
        });
      }
      return assignments;
    },
    replaceAddress(address){
      this.address= address;
      this.$set(this.form, 'address_line_two', this.address['BUILDING'])
      this.$set(this.form, 'postal', this.address['POSTAL'])
      return

    },
    clearAddress(value){
      this.address = value
      this.$set(this.form, 'address_line_two', '')
      this.$set(this.form, 'postal', '')
    }

  },

  computed: {
    client() {
      return this.$store.state.auth.user.client;
    },
    isUpdate() {
      return this.event !== null;
    },
    day() {
      return dayjs(this.date).format('dddd');
    },
  },

  watch: {
    date(val) {
      this.$set(this.form, 'date', val);
    },
  },
};
</script>

<style scoped>
.field-purpose {
  display: flex;
}

.field-repeat {
  margin-top: 4px;
}

.field-location {
  width: 100%;
  margin-bottom: 8px;
}

.field-location .body {
  display: flex;
  margin-top: 5px;
  width: 100%;
}

.required-asterisk:before {
  content: '*';
  margin-right: 4px;
  color: #f56c6c;
}
</style>
