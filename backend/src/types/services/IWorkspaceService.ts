import { Workspace } from "@db/entities/Workspace";
import { TransactionResult } from "types/TransactionResult";
import { IAddEditWorkspaceDTO } from "@shared/types/DTOs/Workspace";

export interface IWorkspaceService {
  create(data: IAddEditWorkspaceDTO): Promise<TransactionResult<Workspace>>;

  update(
    id: number,
    data: IAddEditWorkspaceDTO
  ): Promise<TransactionResult<Workspace>>;
}
