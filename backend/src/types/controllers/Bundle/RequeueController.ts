export namespace RequeueControllerTypes {
  export namespace v1 {
    export type Params = {
      id: number;
    };

    export type Query = {
      workspaceId: number;
    };

    export type Request = CustomRequest<Params, undefined, Query>;
  }
}
