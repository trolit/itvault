import dayjs, {
  Dayjs,
  type UnitType,
  type UnitTypeLong,
  type ManipulateType,
} from "dayjs";
import utc from "dayjs/plugin/utc";
import dayOfYear from "dayjs/plugin/dayOfYear";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(dayOfYear);
dayjs.extend(relativeTime);

export const useDateService = () => ({
  format: (date: string | Dayjs, template = "YYYY-MM-DD") =>
    dayjs(date).format(template),

  dayOfYear: (date: string | Dayjs) => dayjs(date).dayOfYear(),

  now: () => dayjs(),

  unixRange: (
    amount: number,
    unit: string | ManipulateType
  ): [number, number] => {
    const to = dayjs();
    const from = to.subtract(amount, <ManipulateType>unit);

    return [from.unix(), to.unix()];
  },

  unixToUtcUnix: (dateInUnix: number) => dayjs(dateInUnix).utc().unix(),

  endOf: (unit: UnitType) => dayjs().endOf(unit),

  subtract: (date: Dayjs, amount: number, unit: string | ManipulateType) =>
    date.subtract(amount, <ManipulateType>unit),

  date: (date: string) => {
    return {
      parse: () => dayjs(date),
      isSame: (dateToCompare: string) => dayjs(date).isSame(dateToCompare),
      isAfter: (dateToCompare: string) => dayjs(date).isAfter(dateToCompare),
      isBefore: (dateToCompare: string) => dayjs(date).isBefore(dateToCompare),
    };
  },

  fromNow: (date: string) => dayjs(date).fromNow(),

  toNow: (date: string) => dayjs(date).toNow(),

  differenceToNow: (date: string, unit: UnitTypeLong = "millisecond") => {
    const now = dayjs();
    const parsedDate = dayjs(date);

    const difference = parsedDate.diff(now, unit);

    return difference < 0 ? 0 : difference;
  },

  difference: (
    date1: Dayjs,
    date2: Dayjs,
    unit: UnitTypeLong = "millisecond"
  ) => {
    return date1.diff(date2, unit);
  },
});
