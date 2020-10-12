import { ASSIGNMENT_STATUS_WORKER } from '../../config';
const { INTERVAL_S } = ASSIGNMENT_STATUS_WORKER;
import { executeGraphQLQuery } from "../../telegram/hasura-helpers";

const updateAssignmentsMutation = `
  mutation SetEndedAssignmentsStatusesToComplete($now: timestamp) {
    update_assignment(
      where: {
        _and: [
          { status: { _eq: "MATCHED" }}
          { end_dt: { _lte: $now }}
        ]
      }
      _set: {
        status: "COMPLETE"
      }
    ) {
      returning {
        id
      }
    }
  }
`;

async function hasuraUpdateAssignments() {
  try {
    const { data: { update_assignment: { returning }}} = await executeGraphQLQuery(updateAssignmentsMutation, 'SetEndedAssignmentsStatusesToComplete', { now: new Date().toISOString() });
    return returning;
  } catch (err) {
    console.error(`[AssignmentStatusUpdater] ${err}`);
  }
}

module.exports = async function () {
  setInterval(async () => {
    const result = await hasuraUpdateAssignments();
    if (result && result.length > 0) {
      console.log('[AssignmentStatusUpdater] Completed assignments: ' + result.map(assignment => assignment.id));
    }
  }, INTERVAL_S * 1000);
};
