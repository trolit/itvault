import { inject, injectable } from "tsyringe";

import { Di } from "@enums/Di";
import { Workspace } from "@entities/Workspace";
import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";
import { ITagRepository } from "@interfaces/repositories/ITagRepository";
import { IWorkspaceService } from "@interfaces/services/IWorkspaceService";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject(Di.WorkspaceRepository)
    private _workspaceRepository: IWorkspaceRepository,
    @inject(Di.TagRepository)
    private _tagRepository: ITagRepository
  ) {}

  async create(data: AddEditWorkspaceDto): Promise<Workspace | null> {
    const transaction = await this._workspaceRepository.useTransaction();

    const { name, tags } = data;

    try {
      const tagEntities = await this._tagRepository.transactionSaveMany(
        transaction,
        tags
      );

      const workspace = await transaction.manager.save(Workspace, {
        name,
        tagToWorkspace: tagEntities.map(tagEntity => ({ tag: tagEntity })),
      });

      await transaction.commitTransaction();

      return workspace;
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return null;
    } finally {
      await transaction.release();
    }
  }

  async update(
    id: number,
    data: AddEditWorkspaceDto
  ): Promise<Workspace | null> {
    const transaction = await this._workspaceRepository.useTransaction();

    const { name, tags } = data;

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
        tagToWorkspace: tagEntities.map(tagEntity => ({ tag: tagEntity })),
      });

      await transaction.commitTransaction();

      return updatedWorkspace;
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return null;
    } finally {
      await transaction.release();
    }
  }
}
