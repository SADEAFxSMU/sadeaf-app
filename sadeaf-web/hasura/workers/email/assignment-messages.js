export function getMatchedEmailMessage(eventName, startDt) {
  return baseEmailBody(
    'Assignment Matched',
    `You have been matched for ${eventName} happening on ${startDt}. Please check the SADEAF portal for more details.`
  );
}

export function getAssignmentPendingEmailMessage(eventName, startDt) {
  return baseEmailBody(
    'Volunteer Backed out of Assignment',
    `A volunteer has backed out for ${eventName} happening on ${startDt}. Please check the SADEAF portal for more details.`
  );
}

export function getAssignmentCancelledEmailMessage(eventName, startDt) {
  return baseEmailBody(
    'Assignment Cancelled',
    `${eventName} happening on ${startDt} has been cancelled. Please check the SADEAF portal for more details.`
  );
}

function baseEmailBody(title, content) {
  return `<html lang="en">
            <body>
              <h1>${title}</h1>
              <div>${content}</div>
              <p>With regards,</p>
              <p>SADEAF Administrator</p>
            </body>
          </html>`;
}
