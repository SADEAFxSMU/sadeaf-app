const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

export default () => {
  dayjs.extend(utc);
}
