import { BaseMapper } from "./BaseMapper";

import { Workspace } from "@entities/Workspace";
import { IWorkspaceDTO } from "@shared/types/dtos/Workspace";

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
