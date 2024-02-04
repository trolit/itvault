import { IBaseRepository } from "./IBaseRepository";
import { WorkspaceEvent } from "@db/entities/WorkspaceEvent";

export interface IWorkspaceEventRepository
  extends IBaseRepository<WorkspaceEvent> {}
