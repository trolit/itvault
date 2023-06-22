import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Workspace } from "@entities/Workspace";
import { BaseRepository } from "./BaseRepository";
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
}
