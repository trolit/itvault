import utc from "dayjs/plugin/utc";
import { injectable } from "tsyringe";
import { IDateService } from "types/services/IDateService";
import dayjs, { Dayjs, ManipulateType, UnitType } from "dayjs";

import { DateFormats } from "types/DateFormats";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

dayjs.extend(utc);

const precisionFormatters = {
  [DatePrecision.Minutes]: "YYYY-MM-DDTHH:mmZ",
  [DatePrecision.Hours]: "YYYY-MM-DDTHH:00Z",
  [DatePrecision.Days]: "YYYY-MM-DDT00:00Z",
  [DatePrecision.Months]: "YYYY-MM-01T00:00Z",
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

  parse(date: DateFormats): {
    toDate: () => Date;
    toISOString: () => string;
    isSame: (
      dateToCompareTo: DateFormats,
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
        dateToCompareTo: DateFormats,
        precision: DatePrecision
      ) => parsedDate.isSame(dateToCompareTo, precision),
    };
  }

  getDifference(arg: {
    from: DateFormats;
    to: DateFormats;
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
      const formattedDate = dayjs(date)
        .utc()
        .format(precisionFormatters[precision]);

      if (!uniqueDates.includes(formattedDate)) {
        uniqueDates.push(formattedDate);
      }
    }

    return uniqueDates;
  }
}
