import { Dayjs } from "dayjs";

export interface IDateService {
  now(): Dayjs;

  getExpirationDate(expiration: string, separator?: string): string | null;
}
