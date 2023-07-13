import { Tag } from "@entities/Tag";

// @NOTE properties took from entity must be initialized for EntityMapperService
export class WorkspaceDto {
  id = 0;

  name = "";

  tags: Tag[];
}
