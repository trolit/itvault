import { File } from "@entities/File";
import { IBaseRepository } from "./IBaseRepository";
import { IFormDataFile } from "@interfaces/IFormDataFile";
import { TransactionResult } from "types/TransactionResult";

export interface IFileRepository extends IBaseRepository<File> {
  save(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<TransactionResult<File[]>>;

  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]>;

  getAllByBlueprintId(
    workspaceId: number,
    blueprintId: number
  ): Promise<File[]>;

  getOneWithMoreThanTwoVariants(variantIds: string[]): Promise<File | null>;
}
