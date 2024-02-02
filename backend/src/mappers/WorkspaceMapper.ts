import { Workspace } from "@db/entities/Workspace";

import { BaseMapper } from "./BaseMapper";

import { IWorkspaceDTO } from "@shared/types/DTOs/Workspace";

export class WorkspaceMapper
  extends BaseMapper<Workspace>
  implements IWorkspaceDTO
{
  id: number;
  name: string;
  description: string;
  slug: string;
  tags: string[];
  pinnedAt: string;

  constructor(data: Workspace) {
    super(data, ["id", "name", "description", "pinnedAt", "slug"]);

    this.assignInitialKeys();

    this.tags = data.tagToWorkspace.map(({ tag: { value } }) => value);

    return this;
  }
}
