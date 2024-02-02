import { Variant } from "@db/entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";

export interface IVariantService {
  save(arg: {
    name: string;
    workspaceId: number;
    file: IFormDataFile;
    author: { userId: number };
    variantOf: { fileId: number };
  }): Promise<TransactionResult<Variant>>;
}
