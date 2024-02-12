import { injectable } from "tsyringe";
import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";
import { IWorkspaceTraceRepository } from "types/repositories/IWorkspaceTraceRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class WorkspaceTraceRepository
  extends BaseRepository<WorkspaceTrace>
  implements IWorkspaceTraceRepository
{
  constructor() {
    super(WorkspaceTrace);
  }
}
