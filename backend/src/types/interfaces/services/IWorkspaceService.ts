import { Result } from "types/Result";
import { Workspace } from "@entities/Workspace";
import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";

export interface IWorkspaceService {
  create(data: AddEditWorkspaceDto): Promise<Result<Workspace>>;

  update(id: number, data: AddEditWorkspaceDto): Promise<Result<Workspace>>;
}
