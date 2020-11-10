export function getMatchedTelegramMessage(eventName, startDt) {
  return `You have been matched for ${eventName} happening on ${startDt}. Please check the SADEAF portal for more details.`;
}

export function getAssignmentPendingTelegramMessage(eventName, startDt) {
  return `A volunteer has backed out for ${eventName} happening on ${startDt}. Please check the SADEAF portal for more details.`;
}

export function getAssignmentCancelledTelegramMessage(eventName, startDt) {
  return `${eventName} happening on ${startDt} has been cancelled. Please check the SADEAF portal for more details.`;
}
