import { injectable } from "tsyringe";
import { Blueprint } from "@db/entities/Blueprint";
import { IBlueprintRepository } from "types/repositories/IBlueprintRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class BlueprintRepository
  extends BaseRepository<Blueprint>
  implements IBlueprintRepository
{
  constructor() {
    super(Blueprint);
  }
}
