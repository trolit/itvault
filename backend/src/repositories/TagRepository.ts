import { injectable } from "tsyringe";
import { Tag } from "@db/entities/Tag";
import { Like, QueryRunner } from "typeorm";
import { ITagRepository } from "types/repositories/ITagRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class TagRepository
  extends BaseRepository<Tag>
  implements ITagRepository
{
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

        return element ?? transaction.manager.save(Tag, { value });
      })
    );
  }
}
