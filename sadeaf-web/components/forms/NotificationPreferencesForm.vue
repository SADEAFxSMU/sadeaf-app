<template>
  <div>
    <el-form
      :style="formWidthStyle"
      ref="notificationPreferencesForm"
      :rules="validationRules"
      :model="processedData"
      v-loading="$apollo.loading">

      <div class="preference-category">
        <h1>Notification Preferences</h1>
      </div>

      <div class="form-element">
        <el-form-item class="remove-bottom-margin">
          <el-checkbox
            label="Email"
            v-model="form.emailPreferred"
            @change="checkIfNotificationsAreWanted" />
        </el-form-item>
        <div class="form-element-explanation">
          Go to your profile to change the email for notification delivery
        </div>
      </div>

      <div class="form-element">
        <el-form-item class="remove-bottom-margin">
          <el-checkbox
            label="Telegram"
            v-model="form.telegramPreferred"
            @change="checkIfNotificationsAreWanted" />
        </el-form-item>
      </div>

      <transition name="el-fade-in-linear">
        <div class="form-element" v-if="form.telegramPreferred">
          <div style="padding-bottom: 10px; font-size: 16px">
            Your Telegram Username
          </div>
          <el-form-item class="remove-bottom-margin" prop="telegramHandle">
            <el-input v-model="form.telegramHandle" placeholder="@..." />
          </el-form-item>
        </div>
      </transition>

      <transition name="el-fade-in-linear">
        <div v-if="allowNotifications">
          <div class="preference-category">
            <h1>{{ capitalise(accountType) }} alerts</h1>
          </div>

          <!-- Volunteer fields -->
          <div v-if="accountType === 'volunteer'">
            <div class="form-element">
              <el-form-item class="remove-bottom-margin">
                <el-checkbox label="Urgent Assignments" v-model="form.volunteer_urgent" />
              </el-form-item>
              <div class="form-element-explanation">
                You will only be notified of assignments that urgently needs a volunteer. This includes assignments in the next few hours, or 1 to 2 days
              </div>
            </div>
            <div class="form-element">
              <el-form-item class="remove-bottom-margin">
                <el-checkbox label="New Assignments" v-model="form.volunteer_new" />
              </el-form-item>
              <div class="form-element-explanation">
                You will receive notifications of all new assignments
              </div>
            </div>
            <div class="form-element">
              <el-form-item class="remove-bottom-margin">
                <el-checkbox label="Periodic Assignment Updates" v-model="form.volunteer_periodic" />
              </el-form-item>
              <div class="form-element-explanation">
                You will receive periodic updates for assignments that have not been matched to a volunteer
              </div>
            </div>
            <div class="form-element">
              <el-form-item class="remove-bottom-margin">
                <el-checkbox label="Matched Assignments" v-model="form.volunteer_matched" />
              </el-form-item>
              <div class="form-element-explanation">
                You will receive a notification when an assignment you have selected is matched to you
              </div>
            </div>
          </div>
          <!-- Volunteer fields -->

          <!-- Client fields -->
          <div v-if="accountType === 'client'">
            <div class="form-element">
              <el-form-item class="remove-bottom-margin">
                <el-checkbox label="Matched Assignments" v-model="form.client_matched" />
              </el-form-item>
              <div class="form-element-explanation">
                You will be notified when a volunteer has been matched to you
              </div>
            </div>
            <div class="form-element">
              <el-form-item class="remove-bottom-margin">
                <el-checkbox label="Unmatched Assignments" v-model="form.client_unmatched" />
              </el-form-item>
              <div class="form-element-explanation">
                You will be notified if volunteers have still not been matched to you a few hours before your event
              </div>
            </div>
          </div>
          <!-- Client fields -->
        </div>
      </transition>

      <div class="form-element submit-button-wrapper">
        <el-button type="primary" @click="onSubmit">Update</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: "NotificationPreferencesForm",
    props: {
      formWidth: {
        type: String | Number,
        required: true
      }
    },
    data() {
      return {
        form: {
          // set defaults, which will be overrode by data from Hasura
          id: 1,
          volunteer_new: false,
          client_matched: false,
          client_unmatched: false,
          volunteer_matched: false,
          volunteer_periodic: false,
          volunteer_urgent: false,
          email_information: {
            id: 0,
            email_address: ""
          },
          telegram_information: {
            id: 0,
            user_handle: ""
          },
          telegramPreferred: false,
          emailPreferred: false,
          telegramHandle: ""
        },
        // TODO(wy): the account type should be based on the logged in user
        accountType: "volunteer",
        originallyPreferredTelegram: false,
        validationRules: {
          telegramHandle: [
            { validator: this.checkTelegramHandle, trigger: 'blue' }
          ]
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs['notificationPreferencesForm'].validate((valid) => {
          if (valid) {
            this.updateNotificationSettings()
          } else {
            return false
          }
        })
      },
      updateNotificationSettings() {
        /*
          We create this variable in case an error occurs - so we can 'recover' the value of
          the original form. apollo isn't clear if this.form will mutate, but they do it
          this way in their docs.
         */
        const new_notification_settings = this.form;

        this.$apollo.mutate({
          mutation: gql`
            mutation(
              $volunteer_matched: Boolean!,
              $volunteer_new: Boolean!,
              $volunteer_periodic: Boolean!,
              $volunteer_urgent: Boolean!,
              $client_matched: Boolean!,
              $client_unmatched: Boolean!
            ) {
              update_notification_setting_by_pk (
                pk_columns: {id: 1}
                _set: {
                  volunteer_matched: $volunteer_matched,
                  volunteer_new: $volunteer_new,
                  volunteer_periodic: $volunteer_periodic,
                  volunteer_urgent: $volunteer_urgent,
                  client_matched: $client_matched,
                  client_unmatched: $client_unmatched
                }
              ) {
                id
                volunteer_matched
                volunteer_new
                volunteer_periodic
                volunteer_urgent
                client_matched
                client_unmatched
              }
            }
          `,
          variables: {
            volunteer_matched: this.form.volunteer_matched,
            volunteer_new: this.form.volunteer_new,
            volunteer_periodic: this.form.volunteer_periodic,
            volunteer_urgent: this.form.volunteer_urgent,
            client_matched: this.form.client_matched,
            client_unmatched: this.form.client_unmatched
          }
        }).then((data) => {
          console.log('successfully updated!', data);

          if (!this.originallyPreferredTelegram && this.form.telegramPreferred) {
            this.insertTelegramSettings();
          } else if (this.originallyPreferredTelegram && this.form.telegramPreferred) {
            this.updateTelegramSettings();
          } else if (this.originallyPreferredTelegram && !this.form.telegramPreferred) {
            this.deleteTelegramSettings();
          }
        }).catch((error) => {
          console.log('update notification settings error', error)
          // restore original form values
          this.form = new_notification_settings;
        })
      },
      insertTelegramSettings() {
        this.$apollo.mutate({
          mutation: gql`
            mutation(
              $user_handle: String!,
              $notification_setting_id: Int!
            ){
              insert_telegram_information_one (
                object: {
                    user_handle: $user_handle,
                    notification_setting_id: $notification_setting_id
                }
              ) {
                user_handle
                notification_setting_id
              }
            }
          `,
          variables: {
            user_handle: this.form.telegramHandle,
            notification_setting_id: this.form.id
          }
        }).then((data) => {
          console.log("inserted telegram data", data)
        }).catch((error) => {
          console.log('insert telegram settings error', error)
        })
      },
      updateTelegramSettings() {
        this.$apollo.mutate({
          mutation: gql`
            mutation(
              $user_handle: String!,
              $telegram_information_id: Int!
            ){
              update_telegram_information_by_pk (
                pk_columns: {id: $telegram_information_id},
                _set: {user_handle: $user_handle}
              ) {
                user_handle
              }
            }
          `,
          variables: {
            user_handle: this.form.telegramHandle,
            telegram_information_id: this.form.telegram_information.id
          }
        }).then((data) => {
          console.log("updated telegram data", data)
        }).catch((error) => {
          console.log('update telegram data error', error)
        })
      },
      deleteTelegramSettings() {
        this.$apollo.mutate({
          mutation: gql`
            mutation(
              $telegram_information_id: Int!
            ){
              delete_telegram_information_by_pk (
                id: $telegram_information_id
              ) {
                id
              }
            }
          `,
          variables: {
            telegram_information_id: this.form.telegram_information.id
          }
        }).then((data) => {
          console.log("deleted telegram data", data)
        }).catch((error) => {
          console.log('delete telegram data error', error)
        })
      },
      checkTelegramHandle(rule, value, callback) {
        if (this.form.telegramPreferred && value === '') {
          callback(new Error('Please input a telegram handle'));
        } else if (this.form.telegram_information && value.startsWith('@')) {
          callback(new Error('You do not need to add the @ at the start of your handle'))
        } else {
          callback()
        }
      },
      capitalise(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
      },

      checkIfNotificationsAreWanted() {
        if (!this.form.telegramPreferred && !this.form.emailPreferred) {
          const notificationProperties = [
            "volunteer_new", "volunteer_matched", "volunteer_periodic", "volunteer_urgent",
            "client_matched", "client_unmatched"
          ]

          notificationProperties.map(property => {this.form[property] = false})
        }
      }
    },
    computed: {
      /**
       * Processes and returns the notification data from Hasura.
       * Also updates relevant properties needed for the form
       * @return {{}}
       * }
       */
      allowNotifications() {
        return this.form.telegramPreferred || this.form.emailPreferred;
      },
      processedData() {
        if (!this.notification_setting) {
          return this.form;
        }

        const notification_settings = this.notification_setting[0];
        // merge data from Hasura with default form data, with the data from Hasura taking precedence
        const newFormData = Object.assign(this.form, notification_settings)

        // check if the user has specified that he wants to use telegram before
        if (notification_settings.telegram_information) {
          newFormData.telegramPreferred = true;
          newFormData.telegramHandle = notification_settings.telegram_information.user_handle;
          this.originallyPreferredTelegram = true;
        }

        if (notification_settings.email_information) {
          newFormData.emailPreferred = true;
        }
        return newFormData;
      },
      formWidthStyle() {
        return  {
          minWidth: `${this.formWidth}px`,
          maxWidth: `${this.formWidth}px`
        }
      }
    },
    /*
      TODO(wy): use current logged in user to populate form
    */
    apollo: {
      notification_setting: gql`
        query {
          notification_setting(where: {id: {_eq: 1}}) {
            id,
            volunteer_new,
            client_matched,
            client_unmatched,
            volunteer_matched,
            volunteer_periodic,
            volunteer_urgent,
            email_information {
              id
              email_address
            },
            telegram_information {
              id
              user_handle
            }
          }
        }
      `
    }
  }
</script>

<style scoped>

  .form-element {
    padding: 10px 0 5px 0;
  }

  .form-element-explanation {
    font-size: 12px
  }

  .submit-button-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
  }

  .remove-bottom-margin {
    margin-bottom: 0;
  }

  .preference-category {
    padding: 20px 0 10px 0;
  }
</style>

<!--
We are not using scoped styles for some form elements
since we need to override the element-ui CSS
-->
<style>
  .form-element .el-checkbox .el-checkbox__label {
    font-size: 16px;
    color: black;
  }
</style>
