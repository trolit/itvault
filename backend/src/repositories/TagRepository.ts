import { injectable } from "tsyringe";
import { Like, QueryRunner, Repository } from "typeorm";
import { ITagRepository } from "types/repositories/ITagRepository";

import { BaseRepository } from "./BaseRepository";

import { Tag } from "@entities/Tag";

@injectable()
export class TagRepository
  extends BaseRepository<Tag>
  implements ITagRepository
{
  protected database: Repository<Tag>;

  constructor() {
    super(Tag);
  }

  transactionSaveMany(
    transaction: QueryRunner,
    tags: string[]
  ): Promise<Tag[]> {
    return Promise.all(
      tags.map(async value => {
        const element = await transaction.manager.findOneBy(Tag, {
          value: Like(value),
        });

        return element ? element : transaction.manager.save(Tag, { value });
      })
    );
  }
}
