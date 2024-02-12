import utc from "dayjs/plugin/utc";
import { injectable } from "tsyringe";
import { IDateService } from "types/services/IDateService";
import dayjs, { Dayjs, ManipulateType, UnitType } from "dayjs";

import { DatePrecision } from "@shared/types/enums/DatePrecision";

dayjs.extend(utc);

const formatters = {
  [DatePrecision.Minutes]: "YYYY-MM-DDTHH:mm",
  [DatePrecision.Hours]: "YYYY-MM-DDTHH",
  [DatePrecision.Days]: "YYYY-MM-DD",
  [DatePrecision.Months]: "YYYY-MM",
};

@injectable()
export class DateService implements IDateService {
  now(): Dayjs {
    return dayjs();
  }

  getExpirationDate(expiration: string, separator = "-"): string | null {
    if (!expiration.includes(separator)) {
      return null;
    }

    const now = dayjs();

    const [value, unit] = expiration.split(separator);

    const expiresAt = now.add(parseInt(value), <ManipulateType>unit);

    return expiresAt.format();
  }

  getDifference(arg: { from: Date; to: Date; unit: UnitType }): number {
    const { from, to, unit } = arg;

    return dayjs(to).diff(from, unit);
  }

  getUniqueDatesToPrecision(dates: string[], precision: DatePrecision) {
    const uniqueDates: string[] = [];

    for (const date of dates) {
      const formattedDate = dayjs(date).utc().format(formatters[precision]);

      if (!uniqueDates.includes(formattedDate)) {
        uniqueDates.push(formattedDate);
      }
    }

    return uniqueDates;
  }
}
