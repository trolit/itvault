import { IBaseRepository } from "./IBaseRepository";
import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";

export interface IWorkspaceTraceRepository
  extends IBaseRepository<WorkspaceTrace> {}
