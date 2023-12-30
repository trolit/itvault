import { WorkspaceId } from "types/controllers/WorkspaceId";

import { FileMapper } from "@mappers/FileMapper";

export namespace UploadControllerTypes {
  export namespace v1 {
    type Query = WorkspaceId;

    export type Request = CustomRequest<undefined, undefined, Query>;

    export type Response = CustomResponse<FileMapper[]>;
  }
}
