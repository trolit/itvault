import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = AddEditBlueprintDto;

    export type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
