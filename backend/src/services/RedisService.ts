import { Redis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { IRedisService } from "@interfaces/IRedisService";
import { JWT_TOKEN_LIFETIME_IN_SECONDS } from "@config/index";

@injectable()
export class RedisService implements IRedisService {
  constructor(
    @inject(Di.Redis)
    private redis: Redis
  ) {}

  setKey(key: string, value: string): Promise<string | null> {
    return this.redis.set(key, value, "EX", JWT_TOKEN_LIFETIME_IN_SECONDS);
  }

  async getKey(
    key: string
  ): Promise<{ asString: () => string; asParsed: <T>() => T } | null> {
    const value = await this.redis.get(key);

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
