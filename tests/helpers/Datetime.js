import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
const advancedFormat = require('dayjs/plugin/advancedFormat');

dayjs.extend(advancedFormat)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(process.env.TIMEZONE);

class DateTime {
  getCurrentTimestamp() {
    return dayjs().tz().format('YYYY-MM-DD HH:mm:ss');
  }

  createFutureDate(dayCount) {
    return dayjs().tz().add(dayCount, 'day').format('YYYY-MM-DD');
  }

  tomorrowDropOffDate() {
    return dayjs().tz().add(1, 'day').format('ddd[,][ ]MMM[ ]Do');
  }
}

export default new DateTime();
