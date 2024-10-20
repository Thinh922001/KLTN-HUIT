import moment from 'moment-timezone';

type TimeUnit = 'minutes' | 'hours' | 'days' | 'seconds' | 'weeks' | 'months' | 'years';

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const TIME_ZONE = process.env.TIME_ZONE || 'UTC';

export const getAdjustedTimeWithTimeZone = (amount: number = 0, unit: TimeUnit = 'minutes'): string => {
  if (!moment.tz.zone(TIME_ZONE)) {
    throw new Error('Múi giờ không hợp lệ: }');
  }

  if (amount < 0) {
    throw new Error('Giá trị amount không thể là số âm');
  }

  const adjustedTime = moment().tz(TIME_ZONE).add(amount, unit);

  return adjustedTime.format(TIME_FORMAT);
};

export const compareDates = (date1: Date, date2: Date): number => {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error('Tham số phải là đối tượng Date hợp lệ');
  }

  const parsedDate1 = moment.tz(date1, TIME_ZONE);
  const parsedDate2 = moment.tz(date2, TIME_ZONE);

  if (parsedDate1.isBefore(parsedDate2)) {
    return -1;
  } else if (parsedDate1.isAfter(parsedDate2)) {
    return 1;
  } else {
    return 0;
  }
};
