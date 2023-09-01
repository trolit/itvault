import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const useDateService = () => ({
  fromNow: (date: string) => dayjs(date).fromNow(),

  toNow: (date: string) => dayjs(date).toNow(),
});
