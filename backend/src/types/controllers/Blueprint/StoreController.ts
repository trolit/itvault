import { BlueprintMapDto } from "@dtos/mappers/BlueprintMapDto";
import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, AddEditBlueprintDto, Query>;

    export type Response = CustomResponse<BlueprintMapDto>;
  }
}
