import { WorkspaceId } from "types/controllers/WorkspaceId";

import { IAddEditBlueprintDTO } from "@shared/types/dtos/Blueprint";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IAddEditBlueprintDTO;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
