export interface IDateService {
  getExpirationDate(expiration: string, separator: "-"): string | null;
}
