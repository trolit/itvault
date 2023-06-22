import { Blueprint } from "@entities/Blueprint";
import { BlueprintDto } from "types/dtos/BlueprintDto";
import { IBaseRepository } from "./IBaseRepository";

export interface IBlueprintRepository extends IBaseRepository<Blueprint> {
  save(workspaceId: number, data: Partial<BlueprintDto>): Promise<Blueprint>;
}
