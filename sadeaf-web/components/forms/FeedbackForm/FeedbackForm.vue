<template>
  <div class="feedback-form">
    <el-form
      :rules="rules"
      label-position="top"
      ref="feedbackForm"
      :model="feedbackForm"
      label-width="auto"
    >
      <h3 class="form-header">Overall Notetaker Rating</h3>
      <el-divider />

      <el-form-item prop="notetakerConduct" label="Notetaker's Conduct">
        <el-radio-group v-model="feedbackForm.notetakerConduct">
          <el-radio
            v-for="rating in availableRatings"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="notetakerPunctual" label="Notetaker's Punctuality">
        <el-radio-group v-model="feedbackForm.notetakerPunctual">
          <el-radio
            v-for="rating in availableRatings"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <h3 class="form-header">Live Notes Rating</h3>
      <el-divider />

      <el-form-item prop="liveInfoUnderstanding" label="Understanding">
        <el-radio-group v-model="feedbackForm.liveInfoUnderstanding">
          <el-radio
            v-for="rating in availableRatings"
            :label="rating.label"
          >
            {{ rating.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="liveInteraction" label="Interaction Effectiveness">
        <el-radio-group v-model="feedbackForm.liveInteractions">
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

      <el-form-item label="Effectiveness" prop="postSessionNotesEffectiveness">
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

      <h3 class="form-header">Consent</h3>
      <el-divider />

      <el-form-item prop="trainingPrivacyPref" label="Anonymity of Response">
        <span class="feedback-form-disclaimer__height">Your feedback in this form will be shared with the above notetaker, staff and management in the Notetaking department to improve our Notetaking services. Please indicate your preference of confidentiality</span>
        <el-radio-group v-model="feedbackForm.trainingPrivacyPref">
          <el-radio label="public">Yes, I allow my comments, including name and school/institute to be quoted</el-radio>
          <el-radio label="anonymous">Yes, I allow ONLY my comments but not my name or school/institute to be quoted.
            I'd
            like to remain anonymous.
          </el-radio>
          <el-radio label="no">No, I do not allow my comments to be quoted in any way, shape or form.</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="confidentialityPref" label="Confidentiality Preference">
<!--        TODO (Austin): Fix disclaimer styles-->
        <span class="feedback-form-disclaimer__height">Would you allow your comments to be used in SADeaf's publicity and/or training materials?</span>
        <el-radio-group v-model="feedbackForm.confidentialityPref">
          <el-radio label="public">Yes, I allow my comments, including name and school/institute to be quoted</el-radio>
          <el-radio label="anonymous">Yes, I allow ONLY my comments but not my name or school/institute to be quoted.
            I'd
            like to remain anonymous.
          </el-radio>
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

export default {
  // TODO(Austin): Add feedback_completed computed field in event table
  name: 'feedback-form',
  components: { FeedbackRadioGroup },
  data() {
    return {
      availableRatings: [
        { title: 'Strongly Disagree', label: 1 },
        { title: 'Disagree', label: 2 },
        { title: 'Neutral', label: 3 },
        { title: 'Agree', label: 4 },
        { title: 'Strongly Agree', label: 5 },
      ],
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
        additionalComments: '',
        // privacy and confidentality prefs are enum of "public", "anonymous" and "no"
        trainingPrivacyPref: '',
        confidentialityPref: '',
      },
      rules: {
        notetakerPunctual: [
          { required: true, message: 'Please select a value!', trigger: 'blur'},
        ],
        notetakerConduct: [
          { required: true, message: 'Please select a value!', trigger: 'blur'},
        ],
        liveInfoUnderstanding: [
          { required: true, message: 'Please select a value!', trigger: 'blur'},
        ],
        liveInteraction: [
          { required: true, message: 'Please select a value!', trigger: 'blur'},
        ],
        postSessionNotesEffectiveness: [
          { required: true, message: 'Please select a value!', trigger: 'blur'},
        ],
        trainingPrivacyPref: [
          { required: true, message: 'Please select a value!', trigger: 'blur'},
        ],
        confidentialityPref: [
          { required: true, message: 'Please select a value!', trigger: 'blur'},
        ],
      }
    };
  },
  methods: {
    validateRadioGroup(rule, value, callback) {
      if (value === 0) {
        console.log('hello');
        callback(new Error('Please select a value!'));
      } else {
        callback()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit');
        } else {
          return false;
        }
      })
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
}

</style>
<style scoped>
</style>
