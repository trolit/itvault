import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";

import { BaseRepository } from "./BaseRepository";

import { Workspace } from "@entities/Workspace";

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
