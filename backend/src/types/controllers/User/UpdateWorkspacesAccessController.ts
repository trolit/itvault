export namespace UpdateWorkspacesAccessControllerTypes {
  export namespace v1 {
    export type Body = {
      ids: number[];
    };

    export type Request = CustomRequest<void, Body>;

    export type Response = CustomResponse<string>;
  }
}
