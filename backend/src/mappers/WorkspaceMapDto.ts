import { BaseMapDto } from "./BaseMapDto";

import { Workspace } from "@entities/Workspace";
import { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";

export class WorkspaceMapDto
  extends BaseMapDto<Workspace>
  implements IWorkspaceDto
{
  id: number;
  name: string;
  tags: string[];

  constructor(data: Workspace, keys: (keyof Workspace)[] = ["id", "name"]) {
    super(data, keys);

    this.tags = data.tagToWorkspace.map(({ tag: { value } }) => value);

    return this;
  }
}
