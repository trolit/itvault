import { injectable } from "tsyringe";
import { Result } from "types/Result";
import { Repository, EntityManager } from "typeorm";

import { BaseRepository } from "./BaseRepository";

import { Role } from "@entities/Role";
import { IError } from "@interfaces/IError";
import { UpdateRoleDto } from "@dtos/UpdateRoleDto";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";

@injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  protected database: Repository<Role>;

  constructor() {
    super(Role);
  }

  async save(roleId: number, payload: UpdateRoleDto): Promise<Result<Role>> {
    // @TODO refactor transaction
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

        role.permissionToRole.map(value => {
          const updatedPermission = payload.permissions.find(
            element => element.signature === value.permission.signature
          );

          if (updatedPermission) {
            value.enabled = updatedPermission.enabled;
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
