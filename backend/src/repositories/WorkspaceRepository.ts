import { injectable } from "tsyringe";
import { Like, Repository } from "typeorm";

import { BaseRepository } from "./BaseRepository";

import { Tag } from "@entities/Tag";
import { Workspace } from "@entities/Workspace";
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
      const tagEntities = await Promise.all(
        tags.map(async value => {
          const element = await transaction.manager.findOneBy(Tag, {
            value: Like(value),
          });

          return element ? element : transaction.manager.save(Tag, { value });
        })
      );

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
}
