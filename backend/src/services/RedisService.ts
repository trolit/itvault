import { Di } from "@enums/Di";
import { IRedisService } from "@interfaces/IRedisService";
import { Redis } from "ioredis";
import { inject } from "tsyringe";

export class RedisService implements IRedisService {
  constructor(
    @inject(Di.Redis)
    private redis: Redis
  ) {}

  setKey(key: string, value: string): Promise<string | null> {
    return this.redis.set(key, value);
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
