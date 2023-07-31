import { WorkspaceId } from "miscellaneous-types";

export namespace PatchFilenameControllerTypes {
  export namespace v1 {
    export type Params = {
      fileId: number;
    };

    export type Body = {
      filename: string;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
