import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { IDataStoreService } from "@interfaces/IDataStoreService";
import { JWT_TOKEN_LIFETIME_IN_SECONDS } from "@config/index";

@injectable()
export class DataStoreService implements IDataStoreService {
  constructor(
    @inject(Di.Redis)
    private _redis: Redis
  ) {}

  setKey(key: string, value: string): Promise<string | null> {
    return this._redis.set(key, value, "EX", JWT_TOKEN_LIFETIME_IN_SECONDS);
  }

  async getKey(
    key: string
  ): Promise<{ asString: () => string; asParsed: <T>() => T } | null> {
    const value = await this._redis.get(key);

    if (!value) {
      return null;
    }

    return {
      asString: () => value,
      asParsed: <T>() => {
        const parsedValue = <T>JSON.parse(value);

        return parsedValue;
      },
    };
  }
}
