import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";
import { Workspace } from "@entities/Workspace";

export interface IWorkspaceService {
  create(data: AddEditWorkspaceDto): Promise<Workspace | null>;

  update(id: number, data: AddEditWorkspaceDto): Promise<Workspace | null>;
}
