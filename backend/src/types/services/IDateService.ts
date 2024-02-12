import { Dayjs } from "dayjs";
import { DatePrecision } from "@shared/types/enums/DatePrecision";

export interface IDateService {
  now(): Dayjs;

  getExpirationDate(expiration: string, separator?: string): string | null;

  getUniqueDatesToPrecision(
    dates: string[],
    precision: DatePrecision
  ): string[];
}
