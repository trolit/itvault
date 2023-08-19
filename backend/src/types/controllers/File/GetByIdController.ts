import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FileMapper } from "@mappers/FileMapper";

export namespace GetByIdControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, undefined, Query>;

    export type Response = CustomResponse<FileMapper>;
  }
}
