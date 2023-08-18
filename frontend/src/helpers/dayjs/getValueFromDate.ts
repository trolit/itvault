import dayjs, { type UnitTypeLong } from "dayjs";

export default (date: string, unit: UnitTypeLong) => {
  const parsedDate = dayjs(date);

  return parsedDate[unit]();
};
