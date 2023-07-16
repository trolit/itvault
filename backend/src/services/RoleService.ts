import { inject, injectable } from "tsyringe";
import { TransactionResult } from "types/TransactionResult";
import { TransactionError } from "types/custom-errors/TransactionError";

import { Di } from "@enums/Di";
import { Role } from "@entities/Role";
import { Permission } from "@entities/Permission";
import { IRoleService } from "@interfaces/services/IRoleService";
import { AddEditRoleDto, UpdatePermissionDto } from "@dtos/AddEditRoleDto";
import { IRoleRepository } from "@interfaces/repositories/IRoleRepository";

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(Di.RoleRepository)
    private _roleRepository: IRoleRepository
  ) {}

  async create(data: AddEditRoleDto): Promise<TransactionResult<Role>> {
    const transaction = await this._roleRepository.useTransaction();
    const { manager } = transaction;
    const { name, permissions } = data;

    try {
      const permissionEntities = await manager.find(Permission);

      const role = await manager.save(Role, {
        name,
        permissionToRole: permissionEntities.map(entity => {
          const { enabled } = this._findPermissionBySignatureOrThrowError(
            entity.signature,
            permissions
          );

          return {
            enabled,
            permission: entity,
          };
        }),
      });

      await transaction.commitTransaction();

      return TransactionResult.success(role);
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return TransactionResult.failure(
        error instanceof TransactionError ? error.message : undefined
      );
    } finally {
      await transaction.release();
    }
  }

  async update(
    id: number,
    data: AddEditRoleDto
  ): Promise<TransactionResult<Role>> {
    const transaction = await this._roleRepository.useTransaction();
    const { manager } = transaction;
    const { name, permissions } = data;

    try {
      const currentRole = await manager.findOneOrFail(Role, {
        where: { id },
        relations: { permissionToRole: { permission: true } },
      });

      const { permissionToRole } = currentRole;

      await manager.save(Role, {
        ...currentRole,
        name,
        permissionToRole: permissionToRole.map(value => {
          const { permission } = value;

          const { enabled } = this._findPermissionBySignatureOrThrowError(
            permission.signature,
            permissions
          );

          return {
            ...value,
            enabled,
          };
        }),
      });

      await transaction.commitTransaction();

      return TransactionResult.success();
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return TransactionResult.failure(
        error instanceof TransactionError ? error.message : undefined
      );
    } finally {
      await transaction.release();
    }
  }

  private _findPermissionBySignatureOrThrowError(
    signature: string,
    permissions: UpdatePermissionDto[]
  ) {
    const permission = permissions.find(
      element => element.signature === signature
    );

    if (!permission) {
      throw new TransactionError(
        `Permission with signature ${signature} should be included in request!`
      );
    }

    return permission;
  }
}
