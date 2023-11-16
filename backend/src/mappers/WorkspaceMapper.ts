import { BaseMapper } from "./BaseMapper";

import { Workspace } from "@entities/Workspace";
import { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";

export class WorkspaceMapper
  extends BaseMapper<Workspace>
  implements IWorkspaceDto
{
  id: number;
  name: string;
  slug: string;
  tags: string[];
  pinnedAt: string;

  constructor(
    data: Workspace,
    keys: (keyof Workspace)[] = ["id", "name", "pinnedAt", "slug"]
  ) {
    super(data, keys);

    this.tags = data.tagToWorkspace.map(({ tag: { value } }) => value);

    return this;
  }
}
