import { UpdateResult } from "typeorm";
import { Workspace } from "@entities/Workspace";
import { IBaseRepository } from "./IBaseRepository";

export interface IWorkspaceRepository extends IBaseRepository<Workspace> {
  save(name: string, tags: string[]): Promise<Workspace | null>;

  update(
    id: number,
    name: string,
    tags: string[]
  ): Promise<UpdateResult | null>;
}
