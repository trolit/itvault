import dayjs, { type UnitTypeLong } from "dayjs";

export default (date: string, unit: UnitTypeLong = "millisecond") => {
  const now = dayjs();
  const parsedDate = dayjs(date);

  const difference = parsedDate.diff(now, unit);

  return difference < 0 ? 0 : difference;
};
