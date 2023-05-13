import { Workspace } from "@entities/Workspace";
import { IBaseRepository } from "./IBaseRepository";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export interface IWorkspaceRepository extends IBaseRepository<Workspace> {
  getAll(options: {
    filters?: {
      userId?: number;
    };
    pagination: IPaginationOptions;
  }): Promise<[result: Workspace[], total: number]>;
}
