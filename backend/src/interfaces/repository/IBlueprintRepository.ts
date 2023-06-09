import { Blueprint } from "@entities/Blueprint";
import { IBaseRepository } from "./IBaseRepository";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export interface IBlueprintRepository extends IBaseRepository<Blueprint> {
  findAllByWorkspaceId(
    id: number,
    options?: { pagination: IPaginationOptions }
  ): Promise<[Blueprint[], number]>;
}
