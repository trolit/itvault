import { WorkspaceId } from "types/controllers/WorkspaceId";

import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { IAddEditBlueprintDto } from "@shared/types/dtos/Blueprint";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = IAddEditBlueprintDto;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BlueprintMapper>;
  }
}
