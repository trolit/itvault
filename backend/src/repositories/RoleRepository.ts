import { injectable } from "tsyringe";
import { Repository, EntityManager } from "typeorm";

import { Role } from "@entities/Role";
import { Result } from "@utils/Result";
import { IError } from "@interfaces/IError";
import { BaseRepository } from "./BaseRepository";
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
