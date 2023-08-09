import { TransactionResult } from "types/TransactionResult";

export interface IBaseFileService {
  softDeleteFileAndVariants(id: number): Promise<TransactionResult<void>>;
}
