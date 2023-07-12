import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";

import { Tag } from "@entities/Tag";
import { ITagRepository } from "@interfaces/repositories/ITagRepository";

@injectable()
export class TagRepository
  extends BaseRepository<Tag>
  implements ITagRepository
{
  protected database: Repository<Tag>;

  constructor() {
    super(Tag);
  }
}
