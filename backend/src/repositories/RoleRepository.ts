import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { ALL_PERMISSIONS } from "@config/permissions";

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

  async create(data: AddEditRoleDto): Promise<Role | null> {
    const transaction = await this.useTransaction();

    const { manager } = transaction;

    const { name, permissions } = data;

    try {
      const role = await manager.save(Role, {
        name,
        permissionToRole: ALL_PERMISSIONS.map(({ signature }) => {
          const permission = permissions.find(
            element => element.signature === signature
          );

          if (!permission) {
            throw new Error(
              `Permission with signature ${signature} not included in request!`
            );
          }

          return {
            permission: {
              signature,
            },
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
