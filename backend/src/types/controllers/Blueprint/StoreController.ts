import { WorkspaceId } from "miscellaneous-types";
import { BlueprintMapper } from "@mappers/BlueprintMapper";
import { AddEditBlueprintDto } from "@shared/types/dtos/AddEditBlueprintDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Query = WorkspaceId;

    export type Body = AddEditBlueprintDto;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BlueprintMapper>;
  }
}
