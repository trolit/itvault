import { WorkspaceId } from "miscellaneous-types";

export namespace PatchRelativePathControllerTypes {
  export namespace v1 {
    export type Params = {
      fileId: number;
    };

    export type Body = {
      relativePath: string;
    };

    export type Query = WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
