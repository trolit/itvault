import { WorkspaceId } from "miscellaneous-types";

export namespace PatchNameControllerTypes {
  export namespace v1 {
    export type Params = {
      id: string;
    };

    export type Body = {
      name: string;
    };

    export type Query = { fileId: number } & WorkspaceId;

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
