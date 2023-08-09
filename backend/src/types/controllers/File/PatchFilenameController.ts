import { WorkspaceId } from "types/controllers/WorkspaceId";

export namespace PatchFilenameControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = {
      filename: string;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
