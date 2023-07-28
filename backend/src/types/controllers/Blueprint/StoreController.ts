import { BlueprintMapDto } from "@dtos/mappers/BlueprintMapDto";
import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Query = {
      workspaceId: number;
    };

    export type Body = AddEditBlueprintDto;

    export type Request = CustomRequest<undefined, Body, Query>;

    export type Response = CustomResponse<BlueprintMapDto>;
  }
}
