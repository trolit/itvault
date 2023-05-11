import { Workspace } from "@entities/Workspace";
import { IBaseRepository } from "./IBaseRepository";

export interface IWorkspaceRepository extends IBaseRepository<Workspace> {
  getAll(
    take: number,
    skip: number,
    userId?: number
  ): Promise<[result: Workspace[], total: number]>;
}
