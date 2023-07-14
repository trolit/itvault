import { BaseMapDto } from "./BaseMapDto";
import { Workspace } from "@entities/Workspace";

export class WorkspaceMapDto extends BaseMapDto<Workspace> {
  tags: string[];

  constructor(data: Workspace, keys: (keyof Workspace)[] = ["id", "name"]) {
    super(data, keys);

    this.tags = data.tagToWorkspace.map(({ tag: { value } }) => value);

    return this;
  }
}
