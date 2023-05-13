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
import { IPaginationOptions } from "@interfaces/IPaginationOptions";
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
    pagination?: IPaginationOptions;
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

  async update(roleId: number, payload: UpdateRoleDto): Promise<Result<Role>> {
    const transactionResult = await this.database.manager.transaction(
      async (entityManager: EntityManager) => {
        const errors: IError[] = [];

        const role = await entityManager.findOne(Role, {
          where: { id: roleId },
          relations: { permissionToRole: true },
        });

        if (!role) {
          errors.push({ key: roleId, messages: ["Role is not available."] });

          return { errors };
        }

        role.permissionToRole.map(permission => {
          const updatedPermission = payload.permissions.find(
            element => element.id === permission.id
          );

          if (updatedPermission) {
            permission.enabled = updatedPermission.enabled;
          }
        });

        role.name = payload.name;

        const updatedRole = await entityManager.save(role);

        return { errors, updatedRole };
      }
    );

    const { errors, updatedRole } = transactionResult;

    return errors.length ? Result.failure(errors) : Result.success(updatedRole);
  }
}
