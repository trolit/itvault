import dayjs, { type UnitTypeLong } from "dayjs";

export default (date: string, unit: UnitTypeLong = "millisecond") => {
  const parsedDate = dayjs(date);
  const now = dayjs();

  return Math.abs(now.diff(parsedDate, unit));
};
