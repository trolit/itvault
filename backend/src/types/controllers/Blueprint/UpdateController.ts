import { WorkspaceId } from "miscellaneous-types";
import { AddEditBlueprintDto } from "@shared/types/dtos/AddEditBlueprintDto";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = AddEditBlueprintDto;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
