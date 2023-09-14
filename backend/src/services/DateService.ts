import { injectable } from "tsyringe";
import dayjs, { Dayjs, ManipulateType } from "dayjs";
import { IDateService } from "types/services/IDateService";

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
}
