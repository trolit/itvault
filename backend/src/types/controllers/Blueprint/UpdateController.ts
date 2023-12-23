import { WorkspaceId } from "types/controllers/WorkspaceId";

import { IAddEditBlueprintDto } from "@shared/types/dtos/Blueprint";

export namespace UpdateControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = IAddEditBlueprintDto;

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
