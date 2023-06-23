import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { BlueprintDto } from "types/dtos/BlueprintDto";

import { BaseRepository } from "./BaseRepository";

import { Blueprint } from "@entities/Blueprint";
import { IBlueprintRepository } from "@interfaces/repositories/IBlueprintRepository";

@injectable()
export class BlueprintRepository
  extends BaseRepository<Blueprint>
  implements IBlueprintRepository
{
  protected database: Repository<Blueprint>;

  constructor() {
    super(Blueprint);
  }

  save(workspaceId: number, data: BlueprintDto): Promise<Blueprint> {
    return this.database.save({
      ...data,
      workspace: {
        id: workspaceId,
      },
    });
  }
}
