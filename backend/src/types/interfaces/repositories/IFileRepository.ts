import { File } from "@entities/File";
import { IBaseRepository } from "./IBaseRepository";
import { IFormDataFile } from "@interfaces/IFormDataFile";

export interface IFileRepository extends IBaseRepository<File> {
  save(
    workspaceId: number,
    formDataFiles: IFormDataFile[]
  ): Promise<File[] | null>;

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
