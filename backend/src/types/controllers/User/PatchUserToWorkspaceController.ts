export namespace PatchUserToWorkspaceControllerTypes {
  export namespace v1 {
    export type Query = {
      userId: number;
    };

    export type Body = {
      ids: number[];
    };

    export type Request = CustomRequest<void, Body, Query>;

    export type Response = CustomResponse<string>;
  }
}
