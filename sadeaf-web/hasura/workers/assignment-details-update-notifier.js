import pubsub from '../../hasura/pubsub';
import {
  clientDetailsOpsDoc,
  volunteerDetailsOpsDoc,
  volunteerDetailsFromOptInsOpsDoc,
} from './helpers/hasura-queries';
import { executeGraphQLQuery } from '../../telegram/hasura-helpers';
import { DateUtils } from '../../common/date-utils';
import { sendNotifications } from './helpers/notifications';
import { getAssignmentDetailsChangedEmailMessage } from './email/assignment-messages';

/*
Worker that listens for ALL updates to the details on the assignment table.
Sends the appropriate message to involved users based on the new details.
 */
module.exports = async function () {
  const { subscribe, publish } = await pubsub();

  await subscribe('assignment-details-update-notifier', async ({ data }) => {
    await new Promise(async (resolve, reject) => {
      try {
        const { event_id: eventId, volunteer_id: volunteerId, id } = data.event.data.new;

        let clientDetails = await executeGraphQLQuery(clientDetailsOpsDoc, 'ClientDetails', { event_id: eventId });
        let eventName = clientDetails.data.event[0].name;
        const { emailMessage, telegramMessage } = getMessage(
          data.event.data.old,
          data.event.data.new,
          eventName,
          volunteerId
        );

        // there is a matched volunteer - only need to send updates to him
        if (volunteerId) {
          const volunteerDetails = await executeGraphQLQuery(volunteerDetailsOpsDoc, 'VolunteerDetails', {
            volunteer_id: volunteerId,
          });
          const volunteerAccount = volunteerDetails.data.volunteer_by_pk.account;
          const volunteerNotificationSetting = volunteerAccount.notification_setting;

          await sendNotifications(volunteerNotificationSetting, publish, {
            telegramMessage,
            email: {
              subject: `Assignment Details for ${eventName} has changed`,
              message: emailMessage,
              to: volunteerAccount.email,
            },
          });

          resolve();
          return;
        }

        const optedInVolunteers = await executeGraphQLQuery(
          volunteerDetailsFromOptInsOpsDoc,
          'VolunteerDetailsFromOptIns',
          {
            assignment_id: id,
          }
        );

        for (let optIn of optedInVolunteers.data.volunteer_assignment_opt_in) {
          const { notification_setting: notificationSettings } = optIn.volunteer.account;

          await sendNotifications(notificationSettings, publish, {
            telegramMessage,
            email: {
              subject: `Opted-in Assignment Details for ${eventName} has changed`,
              message: emailMessage,
              to: optIn.volunteer.account.email,
            },
          });
        }

        resolve();
      } catch (e) {
        console.error(`[AssignmentDetailsUpdateNotifier] ${e}`);
        reject(e);
      }
    });
  });
};

function getMessage(oldData, newData, eventName, volunteerId) {
  const {
    start_dt: newStartDt,
    end_dt: newEndDt,
    address_line_one: newAddressLineOne,
    address_line_two: newAddressLineTwo,
    postal: newPostalCode,
    room_number: newRoomNumber,
  } = newData;

  const {
    start_dt: oldStartDt,
    end_dt: oldEndDt,
    address_line_one: oldAddressLineOne,
    address_line_two: oldAddressLineTwo,
    postal: oldPostalCode,
    room_number: oldRoomNumber,
  } = oldData;

  const newAssignmentStartDt = DateUtils.humanReadableDt(newStartDt);
  const newAssignmentEndDt = DateUtils.humanReadableDt(newEndDt);
  const oldAssignmentStartDt = DateUtils.humanReadableDt(oldStartDt);
  const oldAssignmentEndDt = DateUtils.humanReadableDt(oldEndDt);
  const formattedNewAddress = formattedAddress(newAddressLineOne, newAddressLineTwo, newPostalCode, newRoomNumber);
  const formattedOldAddress = formattedAddress(oldAddressLineOne, oldAddressLineTwo, oldPostalCode, oldRoomNumber);
  const optInText = volunteerId ? '' : 'opted-in ';

  const telegramMessage = `There is an update to ${eventName}. The ${optInText}assignment is now happening on ${newAssignmentStartDt} to ${newAssignmentEndDt} at ${formattedNewAddress}`;
  const emailMessage = getAssignmentDetailsChangedEmailMessage(
    eventName,
    { oldAssignmentStartDt, oldAssignmentEndDt, formattedOldAddress },
    { newAssignmentStartDt, newAssignmentEndDt, formattedNewAddress }
  );

  return { emailMessage, telegramMessage };
}

function formattedAddress(lineOne, lineTwo, postalCode, roomNumber) {
  const formattedLineTwo = lineTwo ? `${lineTwo}, ` : '';
  const formattedRoomNumber = roomNumber ? `${roomNumber}, ` : '';
  return `${lineOne}, ${formattedLineTwo}${formattedRoomNumber}S(${postalCode})`;
}
