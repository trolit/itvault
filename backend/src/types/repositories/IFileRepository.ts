import { File } from "@entities/File";
import { IBaseRepository } from "./IBaseRepository";

export interface IFileRepository extends IBaseRepository<File> {
  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<File[]>;

  getAllByBlueprintId(
    workspaceId: number,
    blueprintId: number
  ): Promise<File[]>;
}
