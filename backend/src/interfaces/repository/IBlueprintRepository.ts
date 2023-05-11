import { Blueprint } from "@entities/Blueprint";
import { IPaginationOptions } from "@interfaces/IPaginationOptions";

export interface IBlueprintRepository {
  findAllByWorkspaceId(
    id: number,
    options?: { pagination: IPaginationOptions }
  ): Promise<[Blueprint[], number]>;
}
