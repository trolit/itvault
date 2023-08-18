import { WorkspaceId } from "types/controllers/WorkspaceId";

import { BundleFileMapper } from "@mappers/BundleFileMapper";

export namespace GetFilesControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Query = WorkspaceId & { blueprintId: number };

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<BundleFileMapper[]>;
  }
}
