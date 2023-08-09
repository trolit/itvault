import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";

import { BaseRepository } from "./BaseRepository";

import { Blueprint } from "@entities/Blueprint";

@injectable()
export class BlueprintRepository
  extends BaseRepository<Blueprint>
  implements IBlueprintRepository
{
  protected database: Repository<Blueprint>;

  constructor() {
    super(Blueprint);
  }
}
