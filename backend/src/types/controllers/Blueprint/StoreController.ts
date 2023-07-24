import { Blueprint } from "@entities/Blueprint";
import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";

export namespace StoreControllerTypes {
  export namespace v1 {
    export type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<undefined, AddEditBlueprintDto, Query>;

    export type Response = CustomResponse<Blueprint>;
  }
}
