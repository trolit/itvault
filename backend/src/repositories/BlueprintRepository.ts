import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Blueprint } from "@entities/Blueprint";
import { BaseRepository } from "./BaseRepository";
import { BlueprintDto } from "types/dtos/BlueprintDto";
import { IBlueprintRepository } from "types/interfaces/repository/IBlueprintRepository";

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
