export function getMatchedEmailMessage(eventName, startDt) {
  return emailBody(
    'Assignment Matched',
    `You have been matched for ${eventName} happening on ${startDt}. Please check the SADEAF portal for more details.`
  );
}

export function getAssignmentPendingEmailMessage(eventName, startDt) {
  return emailBody(
    'Volunteer Backed out of Assignment',
    `A volunteer has backed out for ${eventName} happening on ${startDt}. Please check the SADEAF portal for more details.`
  );
}

export function getAssignmentCancelledEmailMessage(eventName, startDt) {
  return emailBody(
    'Assignment Cancelled',
    `${eventName} happening on ${startDt} has been cancelled. Please check the SADEAF portal for more details.`
  );
}

export function getAssignmentDetailsChangedEmailMessage(eventName, oldDetails, newDetails) {
  const { oldAssignmentStartDt, oldAssignmentEndDt, formattedOldAddress } = oldDetails;
  const { newAssignmentStartDt, newAssignmentEndDt, formattedNewAddress } = newDetails;

  return emailBody(
    'Assignment Details Changed',
    `
            <p>Assignment details for ${eventName} has changed.</p>
            <p style="font-weight: bold">Old Details</p>
            <p>Time: ${oldAssignmentStartDt} to ${oldAssignmentEndDt}</p>
            <p>Address: ${formattedOldAddress}</p>
            <p style="font-weight: bold">New Details</p>
            <p>Time: ${newAssignmentStartDt} to ${newAssignmentEndDt}</p>
            <p>Address: ${formattedNewAddress}</p>
            `
  );
}

function emailBody(title, content) {
  return `<html lang="en">
            <body>
              <h1>${title}</h1>
              <div style="padding: 10px 0">${content}</div>
              <p>With regards,</p>
              <p>SADEAF Administrator</p>
            </body>
          </html>`;
}
