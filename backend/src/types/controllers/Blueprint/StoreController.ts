import { WorkspaceId } from "miscellaneous-types";
import { BlueprintMapDto } from "@dtos/mappers/BlueprintMapDto";
import { AddEditBlueprintDto } from "@shared/types/dtos/AddEditBlueprintDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = AddEditBlueprintDto;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BlueprintMapDto>;
  }
}
