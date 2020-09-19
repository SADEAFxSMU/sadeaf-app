<template>
  <div class="feedback-form">
    <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane v-for="volunteer in volunteers" :name="volunteer" :label="volunteer"/>
    </el-tabs>
    <el-form
      :rules="rules"
      label-position="top"
      ref="feedbackForm"
      :model="feedbackForm"
      label-width="auto"
    >
      <h3 class="form-header">Overall Notetaker Rating</h3>
      <el-divider />

      <el-form-item prop="notetakerConduct">
        <tooltip-label
          title="Notetaker's Conduct"
          tooltip-info="How well the Notetaker conducted him/herself throughout assignments"
        />
        <el-radio-group v-model="feedbackForm.notetakerConduct">
          <el-radio
            v-for="rating in availableRatings.slice(0, 5)"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="notetakerPunctual">
        <tooltip-label
          title="Notetaker's Punctuality"
          tooltip-info="Notetaker's punctuality score"
        />
        <el-radio-group v-model="feedbackForm.notetakerPunctual">
          <el-radio
            v-for="rating in availableRatings.slice(0, 5)"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <h3 class="form-header">Live Notes Rating</h3>
      <el-divider />

      <el-form-item prop="liveInfoUnderstanding">
        <tooltip-label
          title="Understanding"
          tooltip-info="The live notes/transcriptions are effective for you to understand the information required during the session."
        />
        <el-radio-group v-model="feedbackForm.liveInfoUnderstanding">
          <el-radio
            v-for="rating in availableRatings"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="liveInteraction">
        <tooltip-label
          title="Interaction Effectiveness"
          tooltip-info="The live notes/transcriptions are effective for you to understand the information required during the session."
        />
        <el-radio-group v-model="feedbackForm.liveInteraction">
          <el-radio
            v-for="rating in availableRatings"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-model="feedbackForm.liveComments" label="Live Notes Comments">
        <el-input type="textarea"></el-input>
      </el-form-item>

      <h3 class="form-header">Post-Session Notes Rating</h3>
      <el-divider />

      <el-form-item prop="postSessionNotesEffectiveness">
        <tooltip-label
          title="Effectiveness"
          tooltip-info="The post session notes are effective for you to understand the information from the session."
        />
        <el-radio-group v-model="feedbackForm.postSessionNotesEffectiveness">
          <el-radio
            v-for="rating in availableRatings"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-model="feedbackForm.postSessionComments" label="Post-Session Notes Comments">
        <el-input type="textarea"></el-input>
      </el-form-item>

      <h3 class="form-header">Additional Comments</h3>
      <el-divider />

      <el-form-item v-model="feedbackForm.generalFeedback" label="Additional General Comments">
        <el-input type="textarea"></el-input>
      </el-form-item>

      <h3 class="form-header">Consent</h3>
      <el-divider />

      <el-form-item class="consent-label" prop="trainingPrivacyPref" label="Anonymity of Response">
        <el-row>
          <el-alert title="Disclaimer" show-icon :closable="false" class="feedback-form-disclaimer">
            Your feedback in this form will be shared with the above notetaker, staff and management in the Notetaking
            department to improve our Notetaking services. Please indicate your preference of confidentiality
          </el-alert>
        </el-row>

        <el-radio-group v-model="feedbackForm.trainingPrivacyPref">
          <el-row>
            <el-radio label="public">Yes, I allow my comments, including name and school/institute to be quoted</el-radio>
          </el-row>
          <el-row type="flex">
            <el-col :sm="2">
              <el-radio label="anonymous">Yes, I allow ONLY my comments but not my name or school/institute to be quoted.
                  I'd
                  like to remain anonymous.
              </el-radio>
            </el-col>
          </el-row>
          <el-row>
            <el-radio label="no">No, I do not allow my comments to be quoted in any way, shape or form.</el-radio>
          </el-row>
        </el-radio-group>
      </el-form-item>

      <el-form-item class="consent-label" prop="confidentialityPref" label="Confidentiality Preference">
        <!--        TODO (Austin): Fix disclaimer styles-->
        <el-row>
          <el-alert title="Disclaimer" show-icon :closable="false" class="feedback-form-disclaimer">
            Would you allow your comments to be used in SADeaf's publicity and/or training materials?
          </el-alert>
        </el-row>
        <el-radio-group v-model="feedbackForm.confidentialityPref">
          <el-row>
            <el-radio label="public">Yes, I allow my comments, including name and school/institute to be quoted
            </el-radio>
          </el-row>
          <el-row>
            <el-radio label="anonymous">Yes, I allow ONLY my comments but not my name or school/institute to be quoted.I'd
              like to remain anonymous.
            </el-radio>
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
import gql from 'graphql-tag';

// const submitFeedback = gql`mutation `

export default {
  // TODO(Austin): Add feedback_completed computed field in event table
  name: 'feedback-form',
  components: { TooltipLabel, FeedbackRadioGroup },
  props: {
    volunteers: {
      type: Array
    },
  },
  data() {
    return {
      availableRatings: [
        { title: 'Very Bad', label: 1 },
        { title: 'Bad', label: 2 },
        { title: 'Neutral', label: 3 },
        { title: 'Good', label: 4 },
        { title: 'Very Good', label: 5 },
        { title: 'N/A', label: 6 }
      ],
      activeName: this.volunteers[0],
      feedbackForm: {
        // for ratings very bad - bad - neutral - good - very good are mapped from a range of 1 - 5 respectively
        notetakerPunctual: '',
        notetakerConduct: '',
        liveInfoUnderstanding: '',
        liveInteraction: '',
        postSessionNotesEffectiveness: '',
        // text fields
        liveComments: '',
        postSessionComments: '',
        generalFeedback: '',
        // privacy and confidentality prefs are enum of "public", "anonymous" and "no"
        trainingPrivacyPref: '',
        confidentialityPref: '',
      },
      rules: {
        notetakerPunctual: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        notetakerConduct: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        liveInfoUnderstanding: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        liveInteraction: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        postSessionNotesEffectiveness: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        trainingPrivacyPref: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
        confidentialityPref: [
          { required: true, message: 'Please select a value!', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event);
    },
    validateRadioGroup(rule, value, callback) {
      if (value === 0) {
        console.log('hello');
        callback(new Error('Please select a value!'));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit');
        } else {
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
