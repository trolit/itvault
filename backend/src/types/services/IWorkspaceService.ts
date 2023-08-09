import { Workspace } from "@entities/Workspace";
import { TransactionResult } from "types/TransactionResult";
import { AddEditWorkspaceDto } from "@shared/types/dtos/AddEditWorkspaceDto";

export interface IWorkspaceService {
  create(data: AddEditWorkspaceDto): Promise<TransactionResult<Workspace>>;

  update(
    id: number,
    data: AddEditWorkspaceDto
  ): Promise<TransactionResult<Workspace>>;
}
