<template>
  <div class="feedback-form">

    <feedback-card/>

    <el-form
      :rules="rules"
      label-position="top"
      ref="feedbackForm"
      :model="feedbackForm"
      label-width="auto"
    >
      <h3 class="form-header">Overall Notetaker Rating</h3>
      <el-divider />

      <el-form-item prop="notetaker_conduct">
        <tooltip-label
          title="Notetaker's Conduct"
          tooltip-info="How well the Notetaker conducted him/herself throughout assignments"
        />
        <el-radio-group v-model="feedbackForm.notetaker_conduct">
          <el-radio
            v-for="rating in AVAILABLE_RATINGS.slice(0, 5)"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="notetaker_punctual">
        <tooltip-label
          title="Notetaker's Punctuality"
          tooltip-info="Notetaker's punctuality score"
        />
        <el-radio-group v-model="feedbackForm.notetaker_punctual">
          <el-radio
            v-for="rating in AVAILABLE_RATINGS.slice(0, 5)"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <h3 class="form-header">Live Notes Rating</h3>
      <el-divider />

      <el-form-item prop="live_information_understanding">
        <tooltip-label
          title="Understanding"
          tooltip-info="The live notes/transcriptions are effective for you to understand the information required during the session."
        />
        <el-radio-group v-model="feedbackForm.live_information_understanding">
          <el-radio
            v-for="rating in AVAILABLE_RATINGS"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="live_interaction">
        <tooltip-label
          title="Interaction Effectiveness"
          tooltip-info="The live notes/transcriptions are effective for you to understand the information required during the session."
        />
        <el-radio-group v-model="feedbackForm.live_interaction">
          <el-radio
            v-for="rating in AVAILABLE_RATINGS"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-model="feedbackForm.live_comments" label="Live Notes Comments">
        <el-input type="textarea"></el-input>
      </el-form-item>

      <h3 class="form-header">Post-Session Notes Rating</h3>
      <el-divider />

      <el-form-item prop="post_session_understanding">
        <tooltip-label
          title="Effectiveness"
          tooltip-info="The post session notes are effective for you to understand the information from the session."
        />
        <el-radio-group v-model="feedbackForm.post_session_understanding">
          <el-radio
            v-for="rating in AVAILABLE_RATINGS"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-model="feedbackForm.post_session_comments" label="Post-Session Notes Comments">
        <el-input type="textarea"></el-input>
      </el-form-item>

      <h3 class="form-header">Additional Comments</h3>
      <el-divider />

      <el-form-item v-model="feedbackForm.general_feedback" label="Additional General Comments">
        <el-input type="textarea"></el-input>
      </el-form-item>

      <h3 class="form-header">Consent</h3>
      <el-divider />

      <el-form-item class="consent-label" prop="training_privacy_preference" label="Anonymity of Response">
        <el-row>
          <el-alert title="Disclaimer" show-icon :closable="false" class="feedback-form-disclaimer">
            Your feedback in this form will be shared with the above notetaker, staff and management in the Notetaking
            department to improve our Notetaking services. Please indicate your preference of confidentiality
          </el-alert>
        </el-row>

        <el-radio-group v-model="feedbackForm.training_privacy_preference">
          <el-row v-for="privacyOption in TRAINING_PRIVACY_OPTIONS">
            <el-radio :label="privacyOption.label">{{privacyOption.title}}</el-radio>
          </el-row>
        </el-radio-group>
      </el-form-item>

      <el-form-item class="consent-label" prop="confidentiality_privacy_preference" label="Confidentiality Preference">
        <!--        TODO (Austin): Fix disclaimer styles-->
        <el-row>
          <el-alert title="Disclaimer" show-icon :closable="false" class="feedback-form-disclaimer">
            Would you allow your comments to be used in SADeaf's publicity and/or training materials?
          </el-alert>
        </el-row>
        <el-radio-group v-model="feedbackForm.confidentiality_privacy_preference">
          <el-row v-for="privacyOption in CONFIDENTIALITY_PRIVACY_OPTIONS">
            <el-radio :label="privacyOption.label">{{privacyOption.title}}</el-radio>
          </el-row>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button @click="submitForm('feedbackForm')">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import FeedbackRadioGroup from '@/components/forms/FeedbackForm/FeedbackRadioGroup';
import TooltipLabel from '@/components/forms/FeedbackForm/TooltipLabel';
import FeedbackCard from '@/components/forms/FeedbackForm/FeedbackCard';
import gql from 'graphql-tag';

const INSERT_FEEDBACK = gql`mutation InsertFeedback($live_comments: String!, $live_information_understanding: rating_enum = "", $live_interaction: rating_enum = "", $notetaker_conduct: rating_enum = "", $notetaker_punctual: rating_enum = "", $post_session_comments: String = "", $post_session_understanding: rating_enum = "", $training_privacy_preference: privacy_enum = "", $event_id: Int!, $confidentiality_privacy_preference: privacy_enum = "", $general_feedback: String = "", $volunteer_id: Int!) {
  insert_feedback(objects: {volunteer_id: $volunteer_id, confidentiality_privacy_preference: $confidentiality_privacy_preference, event_id: $event_id, live_comments: $live_comments, live_information_understanding: $live_information_understanding, live_interaction: $live_interaction, notetaker_conduct: $notetaker_conduct, notetaker_punctual: $notetaker_punctual, post_session_comments: $post_session_comments, post_session_understanding: $post_session_understanding, training_privacy_preference: $training_privacy_preference, general_feedback: $general_feedback}) {
    returning {
      confidentiality_privacy_preference
      created_at
      event_id
      general_feedback
      id
      live_information_understanding
      live_comments
      live_interaction
      notetaker_punctual
      post_session_comments
      post_session_understanding
      updated_at
      training_privacy_preference
      volunteer_id
    }
  }
}
 `;

export default {
  // TODO(Austin): Add feedback_completed computed field in event table
  name: 'feedback-form',
  components: { FeedbackCard, TooltipLabel, FeedbackRadioGroup },
  data() {
    return {
      AVAILABLE_RATINGS: [
        { title: 'Very Bad', label: '1' },
        { title: 'Bad', label: '2' },
        { title: 'Neutral', label: '3' },
        { title: 'Good', label: '4' },
        { title: 'Very Good', label: '5' },
        { title: 'N/A', label: '6' },
      ],
      TRAINING_PRIVACY_OPTIONS: [
        { title: 'Yes, I allow my comments, including name and school/institute to be quoted', label: 'public' },
        {
          title: 'Yes, I allow ONLY my comments but not my name or school/institute to be' +
            'quoted I\'d like to remain anonymous.',
          label: 'anonymous',
        },
        { title: 'No, I do not allow my comments to be quoted in any way, shape or form.', label: 'no' },
      ],
      CONFIDENTIALITY_PRIVACY_OPTIONS: [
        { title: 'I allow my feedback, including name and school/institute to be quoted.', label: 'public' },
        {
          title: 'I allow ONLY my feedback but not my name or school/institute to be quoted. I\'d ' +
            'like to remain anonymous.', label: 'anonymous',
        },
      ],
      feedbackForm: {
        // for ratings very bad - bad - neutral - good - very good are mapped from a range of 1 - 5 respectively
        notetaker_punctual: '',
        notetaker_conduct: '',
        live_information_understanding: '',
        live_interaction: '',
        post_session_understanding: '',
        // text fields
        live_comments: '',
        post_session_comments: '',
        general_feedback: '',
        // privacy and confidentality prefs are enum of "public", "anonymous" and "no"
        training_privacy_preference: '',
        confidentiality_privacy_preference: '',
      },
      rules: {
        notetaker_punctual: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        notetaker_conduct: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        live_information_understanding: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        live_interaction: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        post_session_understanding: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        training_privacy_preference: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        confidentiality_privacy_preference: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    console.log('hello')
    this.$refs['feedbackForm'].resetFields();
  },
  computed: {
    volunteerSelected() {
      return this.$store.state.feedbackForm.volunteer;
    },
    eventSelected() {
      return this.$store.state.feedbackForm.event;
    },
  },
  methods: {
    validateRadioGroup(rule, value, callback) {
      if (value === 0) {
        callback(new Error('Please select a value!'));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$apollo.mutate({
            mutation: INSERT_FEEDBACK,
            variables: {
              ...this.feedbackForm,
              volunteer_id: this.volunteerSelected.id,
              event_id: this.eventSelected.eventId,
            },
          })
            .then(r => {
              this.$store.commit('feedbackForm/hideForm');
              this.$refs[formName].resetFields();
              this.$message({
                message: `Successfully submitted feedback for ${this.volunteerSelected.account.name}! Thank you for your feedback.`,
                type: 'success',
              });
            })
            .catch(e => {
              console.log(e);
              this.$message({
                message: `Failed to submit feedback! Please try again.`,
                type: 'error',
              });

            })
          ;
        } else {
          this.$message({message: 'Please fill in all required forms demarked by the asterisk before submitting!', type: 'error'})
          return false;
        }
      });
    },
    updateForm(e) {
      const { formKey, value } = e;
      this.feedbackForm = {
        ...this.feedbackForm,
        [formKey]: value,
      };
      console.log(this.feedbackForm[formKey]);
    },
  },
};
</script>

<style lang="scss">
.feedback-form {
  .el-form-item__content {
    line-height: 20px;
  }

  .consent-label .el-form-item__label {
    padding-bottom: 0 !important;
  }
}

</style>
<style lang="scss" scoped>
.feedback-form-disclaimer {
  margin-bottom: 10px;
}

.form-header {
  &:not(:first-child) {
    padding-top: 25px;
  }
}
</style>
