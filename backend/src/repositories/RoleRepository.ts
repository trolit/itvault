import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";

import { Role } from "@entities/Role";
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

  async update(roleId: number, data: UpdateRoleDto): Promise<Role | null> {
    const transaction = await this.useTransaction();

    const { manager } = transaction;

    const { name, permissions } = data;

    try {
      const currentRole = await manager.findOneOrFail(Role, {
        where: { id: roleId },
        relations: { permissionToRole: true },
      });

      const updatedRole = await manager.save(Role, {
        name,
        permissionToRole: currentRole.permissionToRole.map(permissionToRole => {
          const { permission } = permissionToRole;

          const updatedPermission = permissions.find(
            ({ signature }) => signature === permission.signature
          );

          if (!updatedPermission) {
            throw new Error(
              `Permission with signature ${permission.signature} not included in request!`
            );
          }

          const { signature, enabled } = updatedPermission;

          return {
            enabled,
            permission: {
              signature,
            },
          };
        }),
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
