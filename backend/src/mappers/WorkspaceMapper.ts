import { BaseMapper } from "./BaseMapper";

import { Workspace } from "@entities/Workspace";
import { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";

export class WorkspaceMapper
  extends BaseMapper<Workspace>
  implements IWorkspaceDto
{
  id: number;
  name: string;
  description: string;
  slug: string;
  tags: string[];
  pinnedAt: string;

  constructor(
    data: Workspace,
    keys: (keyof Workspace)[] = [
      "id",
      "name",
      "description",
      "pinnedAt",
      "slug",
    ]
  ) {
    super(data, keys);

    this.tags = data.tagToWorkspace.map(({ tag: { value } }) => value);

    return this;
  }
}
