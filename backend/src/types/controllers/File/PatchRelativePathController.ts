export namespace PatchRelativePathControllerTypes {
  export namespace v1 {
    export type Params = {
      fileId: number;
    };

    export type Body = {
      relativePath: string;
    };

    export type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<Params, Body, Query>;
  }
}
