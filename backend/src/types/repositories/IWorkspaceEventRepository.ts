import { IBaseRepository } from "./IBaseRepository";
import { WorkspaceEvent } from "@db/entities/WorkspaceTrace";

export interface IWorkspaceEventRepository
  extends IBaseRepository<WorkspaceEvent> {}
