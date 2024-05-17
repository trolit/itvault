import { Dayjs, UnitType } from "dayjs";
import { DateFormats } from "types/DateFormats";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

export interface IDateService {
  now(): Dayjs;

  getExpirationDate(expiration: string, separator?: string): string | null;

  parse(date: DateFormats): {
    toDate: () => Date;
    toISOString: () => string;
    isSame: (
      dateToCompareTo: DateFormats,
      precision: DatePrecision
    ) => boolean;
  };

  getDifference(arg: {
    from: DateFormats;
    to: DateFormats;
    unit: UnitType;
  }): number;

  getUniqueDatesToPrecision(
    dates: Date[] | string[],
    precision: DatePrecision
  ): string[];
}
