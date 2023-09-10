import dayOfYear from "dayjs/plugin/dayOfYear";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs, { type UnitTypeLong, type UnitType, Dayjs } from "dayjs";

dayjs.extend(dayOfYear);
dayjs.extend(relativeTime);

export const useDateService = () => ({
  format: (date: string | Dayjs, template = "YYYY-MM-DD") =>
    dayjs(date).format(template),

  dayOfYear: (date: string | Dayjs) => dayjs(date).dayOfYear(),

  now: () => dayjs(),

  endOf: (unit: UnitType) => dayjs().endOf(unit),

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
