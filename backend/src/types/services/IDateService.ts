import { Dayjs, UnitType } from "dayjs";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

export interface IDateService {
  now(): Dayjs;

  getExpirationDate(expiration: string, separator?: string): string | null;

  parse(date: string | number): {
    toDate: () => Date;
    toISOString: () => string;
  };

  getDifference(arg: {
    from: string | Date | number;
    to: string | Date | number;
    unit: UnitType;
  }): number;

  getUniqueDatesToPrecision(
    dates: string[],
    precision: DatePrecision
  ): string[];
}
