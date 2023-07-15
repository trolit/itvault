import { injectable } from "tsyringe";
import { Like, QueryRunner, Repository, UpdateResult } from "typeorm";

import { BaseRepository } from "./BaseRepository";

import { Tag } from "@entities/Tag";
import { Workspace } from "@entities/Workspace";
import { TagToWorkspace } from "@entities/TagToWorkspace";
import { IWorkspaceRepository } from "@interfaces/repositories/IWorkspaceRepository";

@injectable()
export class WorkspaceRepository
  extends BaseRepository<Workspace>
  implements IWorkspaceRepository
{
  protected database: Repository<Workspace>;

  constructor() {
    super(Workspace);
  }

  async save(name: string, tags: string[]): Promise<Workspace | null> {
    const transaction = await this.useTransaction();

    try {
      const tagEntities = await this._adjustTags(transaction, tags);

      const workspace = await transaction.manager.save(
        Workspace,
        transaction.manager.create(Workspace, {
          name,
          tagToWorkspace: tagEntities.map(tagEntity => ({ tag: tagEntity })),
        })
      );

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
    name: string,
    tags: string[]
  ): Promise<UpdateResult | null> {
    const transaction = await this.useTransaction();

    try {
      const workspace = await transaction.manager.findOneByOrFail(Workspace, {
        id,
      });

      const tagEntities = await this._adjustTags(transaction, tags);

      const tagsToWorkspace = tagEntities.map(eo =>
        transaction.manager.create(TagToWorkspace, { tag: eo })
      );

      await transaction.manager.save(Workspace, {
        ...workspace,
        name,
        tagToWorkspace: tagsToWorkspace,
      });

      await transaction.commitTransaction();

      return null;
    } catch (error) {
      console.log(error);

      await transaction.rollbackTransaction();

      return null;
    } finally {
      await transaction.release();
    }
  }

  private async _adjustTags(transaction: QueryRunner, tags: string[]) {
    const tagEntities = await Promise.all(
      tags.map(async value => {
        const element = await transaction.manager.findOneBy(Tag, {
          value: Like(value),
        });

        return element ? element : transaction.manager.save(Tag, { value });
      })
    );

    return tagEntities;
  }
}
