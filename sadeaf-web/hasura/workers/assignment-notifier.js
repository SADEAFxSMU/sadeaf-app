import pubsub from '../pubsub';
import { executeGraphQLQuery } from '../../telegram/hasura-helpers';
import { ASSIGNMENT_STATUSES } from '../../common/types/constants';
import { sendTelegramMessage } from '../../telegram/message-sender';
import { DateUtils } from '../../common/date-utils';
import {
  getMatchedMessage,
  getClientPendingMessage,
  getVolunteerCancelledMessage,
} from '../../telegram/assignment-messages';

/*
Worker that listens for updates to the status on the assignment table.
Sends the appropriate message to involved users based on the new status.
 */
module.exports = async function () {
  const { subscribe } = await pubsub();

  await subscribe('assignment-status-notifier', async ({ data }) => {
    await new Promise(async (resolve, reject) => {
      try {
        let {
          event: {
            data: {
              new: { event_id: eventId, volunteer_id: volunteerId, status: newStatus, start_dt: newStartDt },
            },
          },
        } = data;

        let clientDetails = await executeGraphQLQuery(clientDetailsOpsDoc, 'ClientDetails', { event_id: eventId });
        let clientAccount = clientDetails.data.event[0].client.account;

        let eventName = clientDetails.data.event[0].name;
        let assignmentStartDt = DateUtils.humanReadableDt(newStartDt);

        // We need to make this check since there is no volunteer linked to an assignment if the volunteer cancels an assignment
        if (volunteerId) {
          let volunteerDetails = await executeGraphQLQuery(volunteerDetailsOpsDoc, 'VolunteerDetails', {
            volunteer_id: volunteerId,
          });
          let volunteerAccount = volunteerDetails.data.volunteer_by_pk.account;

          await sendNotifications(volunteerAccount, {
            userType: 'volunteer',
            eventName: eventName,
            startDt: assignmentStartDt,
            assignmentStatus: newStatus,
          });
        }

        await sendNotifications(clientAccount, {
          userType: 'client',
          eventName: eventName,
          startDt: assignmentStartDt,
          assignmentStatus: newStatus,
        });

        resolve();
      } catch (e) {
        console.error(`[AssignmentUpdateNotifier] ${e}`);
        reject(e);
      }
    });
  });
};

async function sendNotifications(accountSettings, { userType, eventName, startDt, assignmentStatus }) {
  let notificationSettings = accountSettings.notification_setting;

  if (!notificationSettings) {
    return;
  }

  let telegramMessage = telegramMessageToSend(assignmentStatus, notificationSettings, eventName, startDt, userType);
  // TODO(sde): send email based on email text
  let email;

  if (email && notificationSettings.email_information) {
    // TODO(sde): send email based on email text
  }

  if (telegramMessage && notificationSettings.telegram_information) {
    await sendTelegramMessage(telegramMessage, notificationSettings.telegram_information.chat_id);
  }
}

function telegramMessageToSend(assignmentStatus, notificationSettings, eventName, startDt, userType) {
  let message;

  switch (assignmentStatus) {
    case ASSIGNMENT_STATUSES.MATCHED:
      if (notificationSettings.volunteer_matched || notificationSettings.client_matched) {
        message = getMatchedMessage(eventName, startDt);
      }
      return message;

    case ASSIGNMENT_STATUSES.PENDING:
      // Only clients need to receive this message, since only volunteers/admins can change the status back to pending
      if (userType === 'client') {
        message = getClientPendingMessage(eventName, startDt);
      }
      return message;

    case ASSIGNMENT_STATUSES.CANCELLED:
      // Only volunteers need to receive this message, since only clients/admins can change the status to cancelled
      if (userType === 'volunteer') {
        message = getVolunteerCancelledMessage(eventName, startDt);
      }
      return message;
  }
}

const notificationDetailsFragment = `
  fragment notificationDetails on account {
    email
    notification_setting {
      volunteer_matched
      client_matched
      telegram_information {
        chat_id
      }
      email_information {
        id
      }
    }
  }
`;

const clientDetailsOpsDoc = `
  query ClientDetails($event_id: Int!) {
    event(where: {id: {_eq: $event_id}}) {
      name
      client {
        account {
          ...notificationDetails
        }
      }
    }
  }

  ${notificationDetailsFragment}
`;

const volunteerDetailsOpsDoc = `
  query VolunteerDetails($volunteer_id: Int!) {
    volunteer_by_pk(id: $volunteer_id) {
      account {
        ...notificationDetails
      }
    }
  }

  ${notificationDetailsFragment}
`;
