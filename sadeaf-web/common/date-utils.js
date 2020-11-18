import dayjs from 'dayjs';
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

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

    assignments.forEach((assignment) => {
      const [dateKey, timeKey] = dayjs(assignment.start_dt).format('YYYYMMDD HH:mm').split(' ');
      if (!assignmentsByDateTime.hasOwnProperty(dateKey)) {
        assignmentsByDateTime[dateKey] = {};
      }
      assignmentsByDateTime[dateKey][timeKey] = assignment;
    });

    return assignmentsByDateTime;
  },
  humanReadableDt(date) {
    return dayjs(date).format('DD MMMM YYYY HH:mm');
  },
  timezoneAdjustedHumanReadableDt(date) {
    return dayjs.utc(date).utcOffset(8).format('DD MMMM YYYY HH:mm');
  },
  humanReadableDate(date) {
    return dayjs(date).format('ddd, DD MMMM YYYY');
  },
  humanReadableMonthYear(date) {
    return dayjs(date).format('MMM YYYY');
  },
  utcToGmt8(date) {
    return dayjs.utc(date).utcOffset(8);
  },
  differenceInHours(startDt, endDt) {
    return dayjs(endDt).diff(dayjs(startDt), 'hour');
  },
};
