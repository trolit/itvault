import { Variant } from "@entities/Variant";
import { IFormDataFile } from "types/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";

export interface IVariantService {
  save(arg: {
    name: string;
    formDataFile: IFormDataFile;
    author: { userId: number };
    variantOf: { fileId: number };
  }): Promise<TransactionResult<Variant>>;
}
