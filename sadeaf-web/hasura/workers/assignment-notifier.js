import pubsub from '../pubsub';
import { executeGraphQLQuery } from '../../telegram/hasura-helpers';
import { ASSIGNMENT_STATUSES } from '../../common/types/constants';
import { DateUtils } from '../../common/date-utils';
import {
  getMatchedTelegramMessage,
  getAssignmentPendingTelegramMessage,
  getAssignmentCancelledTelegramMessage,
} from '../../telegram/assignment-messages';
import {
  getAssignmentCancelledEmailMessage,
  getAssignmentPendingEmailMessage,
  getMatchedEmailMessage,
} from '../../hasura/workers/email/assignment-messages';
import { clientDetailsOpsDoc, volunteerDetailsOpsDoc } from './helpers/hasura-queries';
import { sendNotifications } from './helpers/notifications';

/*
Worker that listens for updates to the status on the assignment table.
Sends the appropriate message to involved users based on the new status.
 */
module.exports = async function () {
  const { subscribe, publish } = await pubsub();

  await subscribe('assignment-status-notifier', async ({ data }) => {
    await new Promise(async (resolve, reject) => {
      try {
        const {
          event_id: eventId,
          volunteer_id: volunteerId,
          status: newStatus,
          start_dt: newStartDt,
        } = data.event.data.new;

        let clientDetails = await executeGraphQLQuery(clientDetailsOpsDoc, 'ClientDetails', { event_id: eventId });
        let clientAccount = clientDetails.data.event[0].client.account;
        let clientNotificationSettings = clientAccount.notification_setting;
        let eventName = clientDetails.data.event[0].name;
        let assignmentStartDt = DateUtils.timezoneAdjustedHumanReadableDt(newStartDt);

        // We need to make this check since there is no volunteer linked to an assignment if the volunteer cancels an assignment
        if (volunteerId) {
          let volunteerDetails = await executeGraphQLQuery(volunteerDetailsOpsDoc, 'VolunteerDetails', {
            volunteer_id: volunteerId,
          });
          let volunteerAccount = volunteerDetails.data.volunteer_by_pk.account;
          let volunteerNotificationSetting = volunteerAccount.notification_setting;

          await sendNotifications(volunteerNotificationSetting, publish, {
            telegramMessage: telegramMessageToSend(
              newStatus,
              volunteerNotificationSetting,
              eventName,
              assignmentStartDt,
              'volunteer'
            ),
            email: {
              subject: emailSubject(newStatus, assignmentStartDt, 'volunteer'),
              message: emailMessageToSend(
                newStatus,
                volunteerNotificationSetting,
                eventName,
                assignmentStartDt,
                'volunteer'
              ),
              to: volunteerAccount.email,
            },
          });
        }

        await sendNotifications(clientNotificationSettings, publish, {
          telegramMessage: telegramMessageToSend(
            newStatus,
            clientNotificationSettings,
            eventName,
            assignmentStartDt,
            'client'
          ),
          email: {
            subject: emailSubject(newStatus, assignmentStartDt, 'client'),
            message: emailMessageToSend(newStatus, clientNotificationSettings, eventName, assignmentStartDt, 'client'),
            to: clientAccount.email,
          },
        });

        resolve();
      } catch (e) {
        console.error(`[AssignmentUpdateNotifier] ${e}`);
        reject(e);
      }
    });
  });
};

function emailSubject(assignmentStatus, startDt, userType) {
  let subject;

  switch (assignmentStatus) {
    case ASSIGNMENT_STATUSES.MATCHED:
      return `Assignment Matched on ${startDt}`;

    case ASSIGNMENT_STATUSES.PENDING:
      // Only clients need to receive this message, since only volunteers/admins can change the status back to pending
      if (userType === 'client') {
        subject = `Volunteer backed out of assignment on ${startDt}`;
      }
      console.log(subject);
      return subject;

    case ASSIGNMENT_STATUSES.CANCELLED:
      // Only volunteers need to receive this message, since only clients/admins can change the status to cancelled
      if (userType === 'volunteer') {
        subject = `Assignment Cancelled on ${startDt}`;
      }
      console.log(subject);
      return subject;
  }
}

function emailMessageToSend(assignmentStatus, notificationSettings, eventName, startDt, userType) {
  let message;

  switch (assignmentStatus) {
    case ASSIGNMENT_STATUSES.MATCHED:
      if (notificationSettings.volunteer_matched || notificationSettings.client_matched) {
        message = getMatchedEmailMessage(eventName, startDt);
      }
      return message;

    case ASSIGNMENT_STATUSES.PENDING:
      // Only clients need to receive this message, since only volunteers/admins can change the status back to pending
      if (userType === 'client') {
        message = getAssignmentPendingEmailMessage(eventName, startDt);
      }
      return message;

    case ASSIGNMENT_STATUSES.CANCELLED:
      // Only volunteers need to receive this message, since only clients/admins can change the status to cancelled
      if (userType === 'volunteer') {
        message = getAssignmentCancelledEmailMessage(eventName, startDt);
      }
      return message;
  }
}

function telegramMessageToSend(assignmentStatus, notificationSettings, eventName, startDt, userType) {
  let message;

  switch (assignmentStatus) {
    case ASSIGNMENT_STATUSES.MATCHED:
      if (notificationSettings.volunteer_matched || notificationSettings.client_matched) {
        message = getMatchedTelegramMessage(eventName, startDt);
      }
      return message;

    case ASSIGNMENT_STATUSES.PENDING:
      // Only clients need to receive this message, since only volunteers/admins can change the status back to pending
      if (userType === 'client') {
        message = getAssignmentPendingTelegramMessage(eventName, startDt);
      }
      return message;

    case ASSIGNMENT_STATUSES.CANCELLED:
      // Only volunteers need to receive this message, since only clients/admins can change the status to cancelled
      if (userType === 'volunteer') {
        message = getAssignmentCancelledTelegramMessage(eventName, startDt);
      }
      return message;
  }
}
