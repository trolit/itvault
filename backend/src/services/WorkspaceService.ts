import kebabCase from "lodash/kebabCase";
import { inject, injectable } from "tsyringe";
import { TransactionResult } from "types/TransactionResult";
import { ITagRepository } from "types/repositories/ITagRepository";
import { IWorkspaceService } from "types/services/IWorkspaceService";
import { TransactionError } from "types/custom-errors/TransactionError";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";
import { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject(Di.WorkspaceRepository)
    private _workspaceRepository: IWorkspaceRepository,
    @inject(Di.TagRepository)
    private _tagRepository: ITagRepository
  ) {}

  async create(
    data: AddEditWorkspaceDto
  ): Promise<TransactionResult<Workspace>> {
    const transaction = await this._workspaceRepository.useTransaction();

    const { name, description, tags } = data;

    try {
      const tagEntities = await this._tagRepository.transactionSaveMany(
        transaction,
        tags
      );

      const workspace = await transaction.manager.save(Workspace, {
        name,
        description,
        slug: kebabCase(name),
        tagToWorkspace: tagEntities.map(tagEntity => ({ tag: tagEntity })),
      });

      await transaction.commitTransaction();

      return TransactionResult.success(workspace);
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
    data: AddEditWorkspaceDto
  ): Promise<TransactionResult<Workspace>> {
    const transaction = await this._workspaceRepository.useTransaction();

    const { name, description, tags } = data;

    try {
      const currentWorkspace = await transaction.manager.findOneByOrFail(
        Workspace,
        {
          id,
        }
      );

      const tagEntities = await this._tagRepository.transactionSaveMany(
        transaction,
        tags
      );

      const updatedWorkspace = await transaction.manager.save(Workspace, {
        ...currentWorkspace,
        name,
        description,
        slug: kebabCase(name),
        tagToWorkspace: tagEntities.map(tagEntity => ({ tag: tagEntity })),
      });

      await transaction.commitTransaction();

      return TransactionResult.success(updatedWorkspace);
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
}
