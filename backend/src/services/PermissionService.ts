import { inject } from "tsyringe";

import { Di } from "@enums/Di";
import { UserDto } from "@dtos/UserDto";
import { Permission } from "@enums/Permission";
import { IRedisService } from "@interfaces/IRedisService";
import { IPermissionService } from "@interfaces/IPermissionService";

export class PermissionService implements IPermissionService {
  constructor(
    @inject(Di.RedisService)
    private redisService: IRedisService
  ) {}

  async hasPermission(
    userId: number,
    permission: Permission
  ): Promise<boolean> {
    const userDetails = await this.redisService.getKey(userId.toString());

    if (!userDetails) {
      return false;
    }

    const { permissions } = userDetails.asParsed<UserDto>();

    const result = permissions.find(({ id }) => id === permission);

    return !!result && result.enabled;
  }
}
