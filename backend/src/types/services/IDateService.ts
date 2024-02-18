import { Dayjs, UnitType } from "dayjs";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

export interface IDateService {
  now(): Dayjs;

  getExpirationDate(expiration: string, separator?: string): string | null;

  parse(date: string | number | Date): {
    toDate: () => Date;
    toISOString: () => string;
    isSame: (
      dateToCompareTo: string | number | Date,
      precision: DatePrecision
    ) => boolean;
  };

  getDifference(arg: {
    from: string | Date | number;
    to: string | Date | number;
    unit: UnitType;
  }): number;

  getUniqueDatesToPrecision(
    dates: Date[] | string[],
    precision: DatePrecision
  ): string[];
}
