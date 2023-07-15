import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";

import { Role } from "@entities/Role";
import { Permission } from "@entities/Permission";
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

  async create(data: AddEditRoleDto): Promise<Role | null> {
    const transaction = await this.useTransaction();

    const { manager } = transaction;

    const { name, permissions } = data;

    try {
      const permissionEntities = await manager.find(Permission);

      const role = await manager.save(Role, {
        name,
        permissionToRole: permissionEntities.map(entity => {
          const permission = permissions.find(
            element => element.signature === entity.signature
          );

          if (!permission) {
            throw new Error(
              `Permission with signature ${entity.signature} not included in request!`
            );
          }

          return {
            enabled: permission.enabled,
            permission: entity,
          };
        }),
      });

      await transaction.commitTransaction();

      return role;
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return null;
    } finally {
      await transaction.release();
    }
  }

  async update(id: number, data: AddEditRoleDto): Promise<Role | null> {
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
        where: { id },
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
