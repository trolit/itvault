import {
  In,
  Not,
  Repository,
  EntityManager,
  FindOptionsWhere,
  FindOptionsRelations,
} from "typeorm";
import isArray from "lodash/isArray";
import { injectable } from "tsyringe";

import { Role } from "@entities/Role";
import { Result } from "@utils/Result";
import { IError } from "@interfaces/IError";
import { BaseRepository } from "./BaseRepository";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { PermissionToRole } from "@entities/PermissionToRole";
import { IRoleRepository } from "@interfaces/repository/IRoleRepository";

@injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  protected database: Repository<Role>;

  constructor() {
    super(Role);
  }

  getAll(options?: {
    includePermissions?: boolean;
    filters?: {
      ids?: number[] | { excluding: number[] };
    };
    pagination?: {
      take: number;
      skip: number;
    };
  }): Promise<[Role[], number]> {
    const where: FindOptionsWhere<Role> = {};

    // @NOTE id filter handler
    (() => {
      const ids = options?.filters?.ids;

      if (!ids) {
        return;
      }

      where.id = isArray(ids) ? In(ids) : Not(ids.excluding);
    })();

    const relations: FindOptionsRelations<Role> | undefined =
      options?.includePermissions
        ? {
            permissionToRole: {
              permission: true,
            },
          }
        : undefined;

    const pagination = (() => {
      if (options?.pagination) {
        const { take, skip } = options.pagination;

        return { take, skip };
      }

      return {};
    })();

    return this.database.findAndCount({
      ...pagination,
      where,
      relations,
    });
  }

  findByName(name: string): Promise<Role | null> {
    return this.database.findOneBy({ name });
  }

  async update(id: number, payload: UpdateRoleDto): Promise<Result<Role>> {
    const transactionResult = await this.database.manager.transaction(
      async (entityManager: EntityManager) => {
        const errors: IError[] = [];

        const role = new Role();

        const permissions: PermissionToRole[] = payload.permissions.map(
          ({ id, enabled }) => {
            const permission: PermissionToRole = new PermissionToRole();

            permission.id = id;
            permission.roleId = id;
            permission.enabled = enabled;

            return permission;
          }
        );

        role.id = id;
        role.name = payload.name;
        role.permissionToRole = permissions;

        const updatedRole = await entityManager.save(role);

        if (!updatedRole) {
          errors.push({ key: id, messages: ["Failed to update role."] });

          return { errors };
        }

        return { errors, updatedRole };
      }
    );

    const { errors, updatedRole } = transactionResult;

    return errors.length ? Result.failure(errors) : Result.success(updatedRole);
  }
}
