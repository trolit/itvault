import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";

import { Role } from "@entities/Role";
import { AddEditRoleDto } from "@dtos/AddEditRoleDto";
import { PermissionToRole } from "@entities/PermissionToRole";
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

  async update(roleId: number, data: AddEditRoleDto): Promise<Role | null> {
    const transaction = await this.useTransaction();

    const { manager } = transaction;

    const { name, permissions } = data;

    const updatePermissionToRole = (permissionToRole: PermissionToRole) => {
      const { permission } = permissionToRole;

      const updatedPermission = permissions.find(
        ({ signature }) => signature === permission.signature
      );

      if (!updatedPermission) {
        throw new Error(
          `Permission with signature ${permission.signature} not included in request!`
        );
      }

      const { enabled } = updatedPermission;

      return {
        ...permissionToRole,
        enabled,
      };
    };

    try {
      const currentRole = await manager.findOneOrFail(Role, {
        where: { id: roleId },
        relations: { permissionToRole: { permission: true } },
      });

      const { permissionToRole } = currentRole;

      const updatedRole = await manager.save(Role, {
        ...currentRole,
        name,
        permissionToRole: permissionToRole.map(value =>
          updatePermissionToRole(value)
        ),
      });

      await transaction.commitTransaction();

      return updatedRole;
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return null;
    } finally {
      await transaction.release();
    }
  }
}
