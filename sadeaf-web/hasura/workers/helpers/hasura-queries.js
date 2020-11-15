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

export const clientDetailsOpsDoc = `
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

export const volunteerDetailsOpsDoc = `
  query VolunteerDetails($volunteer_id: Int!) {
    volunteer_by_pk(id: $volunteer_id) {
      account {
        ...notificationDetails
      }
    }
  }

  ${notificationDetailsFragment}
`;

export const volunteerDetailsFromOptInsOpsDoc = `
  query VolunteerDetailsFromOptIns($assignment_id: Int!) {
    volunteer_assignment_opt_in(where: {assignment_id: {_eq: $assignment_id}}) {
      volunteer{
        account {
          ...notificationDetails
        }
      }
    }
  }

  ${notificationDetailsFragment}
`;
