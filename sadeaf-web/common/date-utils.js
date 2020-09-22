import dayjs from "dayjs";

export const DateUtils = {
  isBeforeToday(date) {
    // Necessary to set h, m and s to 00:00:00
    const today = new Date(new Date().toDateString());
    return date < today;
  },
  isAfterToday(date) {
    const today = new Date(new Date().toDateString());
    return date > today;
  },
  groupAssignmentsByDateTime(assignments) {
    const assignmentsByDateTime = {};

    assignments.forEach(assignment => {
      const [dateKey, timeKey] = dayjs(assignment.start_dt).format('YYYYMMDD HH:mm').split(' ');
      if (!assignmentsByDateTime.hasOwnProperty(dateKey)) {
        assignmentsByDateTime[dateKey] = {};
      }
      assignmentsByDateTime[dateKey][timeKey] = assignment;
    });

    return assignmentsByDateTime;
  },
  humanReadableDt(date) {
    return dayjs(date).format('DD MMMM YYYY HH:MM');
  }
}
