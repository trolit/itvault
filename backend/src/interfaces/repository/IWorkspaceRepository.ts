import { Workspace } from "@entities/Workspace";

export interface IWorkspaceRepository {
  getAll(
    take: number,
    skip: number,
    userId?: number
  ): Promise<[result: Workspace[], total: number]>;
}
