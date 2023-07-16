import { File } from "@entities/File";
import { Result } from "types/Result";
import { IBaseRepository } from "./IBaseRepository";
import { IFormDataFile } from "@interfaces/IFormDataFile";

export interface IFileRepository extends IBaseRepository<File> {
  save(
    userId: number,
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<Result<File[]>>;

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
