import { BaseMapDto } from "./BaseMapDto";
import { Workspace } from "@entities/Workspace";

export class WorkspaceDto extends BaseMapDto<Workspace> {
  constructor(
    data: Workspace,
    keys: (keyof Workspace)[] = ["id", "name", "tags"]
  ) {
    super(data, keys);

    return this;
  }
}
