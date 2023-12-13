export namespace PatchUserToWorkspaceControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Body = {
      ids: number[];
    };

    export type Request = CustomRequest<Params, Body>;

    export type Response = CustomResponse<string>;
  }
}
