import { Directory } from "@entities/Directory";
import { IBaseRepository } from "./IBaseRepository";

export interface IDirectoryRepository extends IBaseRepository<Directory> {
  getAllByRelativePath(
    workspaceId: number,
    relativePath: string
  ): Promise<Directory[]>;

  getAllByBlueprintId(
    workspaceId: number,
    blueprintId: number
  ): Promise<Directory[]>;
}
