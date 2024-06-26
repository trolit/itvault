import { WorkspaceId } from "types/controllers/WorkspaceId";

import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { IAddEditBlueprintDTO } from "@shared/types/DTOs/Blueprint";

export namespace AddControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = IAddEditBlueprintDTO;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BlueprintMapper>;
  }
}
