import dayjs from "dayjs";

export default (date: string, template = "YYYY-MM-DD") => {
  return dayjs(date).format(template);
};
