import { WorkspaceId } from "types/controllers/WorkspaceId";

import { BundleBlueprintMapper } from "@mappers/BundleBlueprintMapper";

export namespace GetBlueprintsControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<BundleBlueprintMapper[]>;
  }
}
