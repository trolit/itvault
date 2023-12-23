import { Workspace } from "@entities/Workspace";
import { TransactionResult } from "types/TransactionResult";
import { IAddEditWorkspaceDto } from "@shared/types/dtos/Workspace";

export interface IWorkspaceService {
  create(data: IAddEditWorkspaceDto): Promise<TransactionResult<Workspace>>;

  update(
    id: number,
    data: IAddEditWorkspaceDto
  ): Promise<TransactionResult<Workspace>>;
}
