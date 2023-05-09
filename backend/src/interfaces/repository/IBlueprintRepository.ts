import { Blueprint } from "@entities/Blueprint";

export interface IBlueprintRepository {
  findAllByWorkspaceName(name: string): Promise<[Blueprint[], number]>;
}
