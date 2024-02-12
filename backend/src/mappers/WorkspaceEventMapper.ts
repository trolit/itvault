import { WorkspaceEvent } from "@db/entities/WorkspaceTrace";

import { BaseMapper } from "./BaseMapper";

import { Action } from "@shared/types/enums/Action";
import { IWorkspaceEventDTO } from "@shared/types/DTOs/Workspace";

export class WorkspaceEventMapper
  extends BaseMapper<WorkspaceEvent>
  implements IWorkspaceEventDTO
{
  id: number;
  entity: string;
  action: Action;
  targetId: string;
  createdAt: string;
  createdBy: { id: number; fullName: string };

  constructor(data: WorkspaceEvent) {
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
