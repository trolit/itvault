import { Role } from "@db/entities/Role";
import { inject, injectable } from "tsyringe";
import { Permission } from "@db/entities/Permission";
import { IRoleService } from "types/services/IRoleService";
import { TransactionResult } from "types/TransactionResult";
import { IRoleRepository } from "types/repositories/IRoleRepository";
import { TransactionError } from "types/custom-errors/TransactionError";

import { Di } from "@enums/Di";
import { Service } from "@enums/Service";
import { IAddEditRoleDTO } from "@shared/types/DTOs/Role";
import { IPermissionUpdateDTO } from "@shared/types/DTOs/Permission";

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(Di.RoleRepository)
    private _roleRepository: IRoleRepository
  ) {}

  async create(
    userId: number,
    data: IAddEditRoleDTO
  ): Promise<TransactionResult<Role>> {
    const transaction = await this._roleRepository.useTransaction();
    const { manager } = transaction;
    const { name, description, permissions } = data;

    try {
      const permissionEntities = await manager.find(Permission);

      const role = await manager.save(Role, {
        name,
        description,
        createdBy: {
          id: userId,
        },
        updatedBy: {
          id: userId,
        },
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
      log.error({
        error,
        service: Service.TypeORM,
        message: `Failed to create role!`,
      });

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
    userId: number,
    data: IAddEditRoleDTO
  ): Promise<TransactionResult<Role>> {
    const transaction = await this._roleRepository.useTransaction();
    const { manager } = transaction;
    const { name, permissions, description } = data;

    try {
      const currentRole = await manager.findOneOrFail(Role, {
        where: { id },
        relations: { permissionToRole: { permission: true } },
      });

      const { permissionToRole } = currentRole;

      await manager.save(Role, {
        ...currentRole,
        name,
        description,
        updatedBy: {
          id: userId,
        },
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
      log.error({
        error,
        service: Service.TypeORM,
        message: `Failed to update role!`,
      });

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
    permissions: IPermissionUpdateDTO[]
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
