import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";

import { BaseMapper } from "./BaseMapper";

import { Action } from "@shared/types/enums/Action";
import { IWorkspaceTraceDTO } from "@shared/types/DTOs/Workspace";

export class WorkspaceTraceMapper
  extends BaseMapper<WorkspaceTrace>
  implements IWorkspaceTraceDTO
{
  id: number;
  entity: string;
  action: Action;
  targetId: string;
  createdAt: string;
  createdBy: { id: number; fullName: string };

  constructor(data: WorkspaceTrace) {
    super(data, ["id", "entity", "action", "targetId", "createdAt"]);

    this.assignInitialKeys();

    const { user } = data;

    this.createdBy = {
      id: user.id,
      fullName: user.fullName,
    };

    return this;
  }
}
