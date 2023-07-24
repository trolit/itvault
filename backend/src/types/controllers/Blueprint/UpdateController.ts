import { AddEditBlueprintDto } from "@dtos/AddEditBlueprintDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Query = {
      workspaceId: number;
    };

    export type Params = {
      id: number;
    };

    export type Request = CustomRequest<Params, AddEditBlueprintDto, Query>;
  }
}
