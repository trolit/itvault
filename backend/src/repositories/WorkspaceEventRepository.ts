import { injectable } from "tsyringe";
import { WorkspaceEvent } from "@db/entities/WorkspaceTrace";
import { IWorkspaceEventRepository } from "types/repositories/IWorkspaceEventRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class WorkspaceEventRepository
  extends BaseRepository<WorkspaceEvent>
  implements IWorkspaceEventRepository
{
  constructor() {
    super(WorkspaceEvent);
  }
}
