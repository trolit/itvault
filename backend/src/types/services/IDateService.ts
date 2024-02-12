import { Dayjs, UnitType } from "dayjs";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

export interface IDateService {
  now(): Dayjs;

  getExpirationDate(expiration: string, separator?: string): string | null;

  getDifference(arg: { from: Date; to: Date; unit: UnitType }): number;

  getUniqueDatesToPrecision(
    dates: string[],
    precision: DatePrecision
  ): string[];
}
