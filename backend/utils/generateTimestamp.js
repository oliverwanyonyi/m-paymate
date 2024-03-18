const moment  = require('moment');

// generate timestamp in YYYYMMDDHHmmss format
const generateTimestamp = () => {
  const currentDate = moment();
  const timestamp = currentDate.format('YYYYMMDDHHmmss');
  return timestamp;
};

module.exports = generateTimestamp