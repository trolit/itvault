import utc from "dayjs/plugin/utc";
import { injectable } from "tsyringe";
import { IDateService } from "types/services/IDateService";
import dayjs, { Dayjs, ManipulateType, UnitType } from "dayjs";

import { DatePrecision } from "@shared/types/enums/DatePrecision";

dayjs.extend(utc);

const formatters = {
  [DatePrecision.Minutes]: "YYYY-MM-DDTHH:mm",
  [DatePrecision.Hours]: "YYYY-MM-DDTHH:00",
  [DatePrecision.Days]: "YYYY-MM-DDT00:00",
  [DatePrecision.Months]: "YYYY-MM-01T00:00",
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

  parse(date: string | number | Date): {
    toDate: () => Date;
    toISOString: () => string;
    isSame: (
      dateToCompareTo: string | number | Date,
      precision: DatePrecision
    ) => boolean;
  } {
    let fixedDate = date;

    // @NOTE convert seconds to milliseconds
    if (typeof date === "number" && date.toString().length === 10) {
      fixedDate = date * 1000;
    }

    const parsedDate = dayjs(fixedDate);

    return {
      toISOString: () => parsedDate.toISOString(),
      toDate: () => parsedDate.toDate(),
      isSame: (
        dateToCompareTo: string | number | Date,
        precision: DatePrecision
      ) => parsedDate.isSame(dateToCompareTo, precision),
    };
  }

  getDifference(arg: {
    from: string | Date | number;
    to: string | Date | number;
    unit: UnitType;
  }): number {
    const { from, to, unit } = arg;

    return dayjs(to).diff(from, unit);
  }

  getUniqueDatesToPrecision(
    dates: Date[] | string[],
    precision: DatePrecision
  ) {
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
