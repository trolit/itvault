import dayjs, { type UnitTypeLong } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const useDateService = () => ({
  format: (date: string, template = "YYYY-MM-DD") =>
    dayjs(date).format(template),

  now: () => dayjs(),

  fromNow: (date: string) => dayjs(date).fromNow(),

  toNow: (date: string) => dayjs(date).toNow(),

  differenceToNow: (date: string, unit: UnitTypeLong = "millisecond") => {
    const now = dayjs();
    const parsedDate = dayjs(date);

    const difference = parsedDate.diff(now, unit);

    return difference < 0 ? 0 : difference;
  },
});
