import { injectable } from "tsyringe";
import { Workspace } from "@db/entities/Workspace";
import { IWorkspaceRepository } from "types/repositories/IWorkspaceRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class WorkspaceRepository
  extends BaseRepository<Workspace>
  implements IWorkspaceRepository
{
  constructor() {
    super(Workspace);
  }
}
