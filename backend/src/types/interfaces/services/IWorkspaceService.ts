import { Workspace } from "@entities/Workspace";
import { AddEditWorkspaceDto } from "@dtos/AddEditWorkspaceDto";
import { TransactionResult } from "types/TransactionResult";

export interface IWorkspaceService {
  create(data: AddEditWorkspaceDto): Promise<TransactionResult<Workspace>>;

  update(
    id: number,
    data: AddEditWorkspaceDto
  ): Promise<TransactionResult<Workspace>>;
}
